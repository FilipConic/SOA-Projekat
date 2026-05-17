<#
.SYNOPSIS
Run the protobuf generator, build the gateway, and launch Docker services on Windows.
#>

Set-StrictMode -Version Latest

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptDir
try {
    $protocScript = Join-Path $scriptDir 'protoc-run.ps1'
    if (-not (Test-Path $protocScript)) {
        throw "Cannot find $protocScript"
    }

    & $protocScript

    Push-Location gateway
    $oldCgo = $env:CGO_ENABLED
    $oldGoos = $env:GOOS
    try {
        $env:CGO_ENABLED = '0'
        $env:GOOS = 'linux'
        go build -o gateway main.go
    }
    finally {
        $env:CGO_ENABLED = $oldCgo
        $env:GOOS = $oldGoos
        Pop-Location
    }

    if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        docker-compose up --build -d
    }
    else {
        docker compose up --build -d
    }
}
finally {
    Pop-Location
}
