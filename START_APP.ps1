$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8000
$url = "http://localhost:$port/?build=0.4.11"

function Write-HttpResponse {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$StatusCode,
        [string]$StatusText,
        [string]$ContentType,
        [byte[]]$Body,
        [bool]$HeadOnly = $false
    )

    $header = "HTTP/1.1 $StatusCode $StatusText`r`n" +
              "Content-Type: $ContentType`r`n" +
              "Content-Length: $($Body.Length)`r`n" +
              "Cache-Control: no-store, no-cache, must-revalidate`r`n" +
              "Pragma: no-cache`r`n" +
              "Connection: close`r`n`r`n"

    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    if (-not $HeadOnly -and $Body.Length -gt 0) {
        $Stream.Write($Body, 0, $Body.Length)
    }
    $Stream.Flush()
}

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.js'   = 'text/javascript; charset=utf-8'
    '.mjs'  = 'text/javascript; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.webp' = 'image/webp'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.txt'  = 'text/plain; charset=utf-8'
    '.md'   = 'text/plain; charset=utf-8'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)

try {
    $listener.Start()
} catch {
    Write-Host ''
    Write-Host "Could not start the app on port $port." -ForegroundColor Red
    Write-Host "Another copy may already be running. Close the other START_APP window and try again." -ForegroundColor Yellow
    Write-Host ''
    Read-Host 'Press Enter to close'
    exit 1
}

Clear-Host
Write-Host 'TOP ELEVEN TOOL - LOCAL APP SERVER' -ForegroundColor Cyan
Write-Host '==================================' -ForegroundColor Cyan
Write-Host ''
Write-Host "App folder : $root"
Write-Host "Open at    : $url" -ForegroundColor Green
Write-Host ''
Write-Host 'Keep this window open while you use the app.' -ForegroundColor Yellow
Write-Host 'Press Ctrl+C here when you want to stop it.'
Write-Host ''

Start-Process $url

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new(
                $stream,
                [System.Text.Encoding]::ASCII,
                $false,
                8192,
                $true
            )

            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) {
                continue
            }

            do {
                $line = $reader.ReadLine()
            } while ($null -ne $line -and $line -ne '')

            $parts = $requestLine.Split(' ')
            if ($parts.Length -lt 2) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Bad Request')
                Write-HttpResponse $stream 400 'Bad Request' 'text/plain; charset=utf-8' $body
                continue
            }

            $method = $parts[0].ToUpperInvariant()
            if ($method -ne 'GET' -and $method -ne 'HEAD') {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Method Not Allowed')
                Write-HttpResponse $stream 405 'Method Not Allowed' 'text/plain; charset=utf-8' $body
                continue
            }

            $rawTarget = $parts[1]
            $requestUri = [System.Uri]::new("http://localhost$rawTarget")
            $path = [System.Uri]::UnescapeDataString($requestUri.AbsolutePath)

            if ($path -eq '/') {
                $path = '/index.html'
            }

            $relativePath = $path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $fullPath = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath))
            $rootPrefix = [System.IO.Path]::GetFullPath($root + [System.IO.Path]::DirectorySeparatorChar)

            if (-not $fullPath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
                Write-HttpResponse $stream 403 'Forbidden' 'text/plain; charset=utf-8' $body ($method -eq 'HEAD')
                continue
            }

            if ((Test-Path -LiteralPath $fullPath -PathType Container)) {
                $fullPath = Join-Path $fullPath 'index.html'
            }

            if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
                Write-HttpResponse $stream 404 'Not Found' 'text/plain; charset=utf-8' $body ($method -eq 'HEAD')
                continue
            }

            $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
            $contentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { 'application/octet-stream' }
            $body = [System.IO.File]::ReadAllBytes($fullPath)
            Write-HttpResponse $stream 200 'OK' $contentType $body ($method -eq 'HEAD')
        } catch {
            try {
                if ($null -ne $stream) {
                    $body = [System.Text.Encoding]::UTF8.GetBytes('Internal Server Error')
                    Write-HttpResponse $stream 500 'Internal Server Error' 'text/plain; charset=utf-8' $body
                }
            } catch {}
        } finally {
            if ($null -ne $client) {
                $client.Close()
            }
        }
    }
} finally {
    $listener.Stop()
}
