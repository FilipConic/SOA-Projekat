<#
.SYNOPSIS
Generate protobuf artifacts for both Go and Node.js projects on Windows.
#>

Set-StrictMode -Version Latest

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptDir
try {
    $protoc = "protoc"

    $goPlugin = Get-Command protoc-gen-go -ErrorAction SilentlyContinue
    $goGrpcPlugin = Get-Command protoc-gen-go-grpc -ErrorAction SilentlyContinue
    if ($null -ne $goPlugin -and $null -ne $goGrpcPlugin) {
        & $protoc -I proto `
            --go_out="$PWD\gateway\gen" --go_opt=paths=source_relative `
            --go-grpc_out="$PWD\gateway\gen" --go-grpc_opt=paths=source_relative `
            proto/common/user.proto `
            proto/blog/blog.proto
    }
    else {
        Write-Host "Skipping Go gRPC generation; install missing Go plugins if needed:"
        Write-Host "  go install google.golang.org/protobuf/cmd/protoc-gen-go@latest"
        Write-Host "  go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest"
    }

    $grpcGatewayPlugin = Get-Command protoc-gen-grpc-gateway -ErrorAction SilentlyContinue
    if ($null -ne $grpcGatewayPlugin) {
        & $protoc -I proto `
            --grpc-gateway_out="$PWD\gateway\gen" --grpc-gateway_opt=paths=source_relative `
            proto/common/user.proto `
            proto/blog/blog.proto
    }
    else {
        Write-Host "Skipping grpc-gateway generation; install the plugin if needed:"
        Write-Host "  go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest"
    }

    $grpcTools = Join-Path $scriptDir 'blog\node_modules\.bin\grpc_tools_node_protoc.exe'
    if (Test-Path "$grpcTools.cmd") { $grpcTools = "$grpcTools.cmd" }
    elseif (-not (Test-Path $grpcTools)) {
        throw "grpc_tools_node_protoc not found. Run npm install in blog first."
    }

    $protocGenTs = Join-Path $scriptDir 'blog\node_modules\.bin\protoc-gen-ts.exe'
    if (Test-Path "$protocGenTs.cmd") { $protocGenTs = "$protocGenTs.cmd" }
    elseif (-not (Test-Path $protocGenTs)) {
        throw "protoc-gen-ts not found. Run npm install --save-dev ts-protoc-gen in blog first."
    }

    & $grpcTools `
        -I proto `
        --js_out=import_style=commonjs,binary:blog/gen `
        --grpc_out=grpc_mode=grpc-js:blog/gen `
        --plugin=protoc-gen-ts=$protocGenTs `
        --ts_out=blog/gen `
        proto/google/api/annotations.proto `
        proto/google/api/http.proto `
        proto/common/user.proto `
        proto/blog/blog.proto

    $generatedFile = Join-Path $scriptDir 'blog\gen\blog\blog_grpc_pb.js'
    if (Test-Path $generatedFile) {
        (Get-Content $generatedFile -Raw) -replace "require\('grpc'\)", "require('@grpc/grpc-js')" | Set-Content $generatedFile -Encoding UTF8
    }
    else {
        Write-Warning "Generated file not found: $generatedFile"
    }
}
finally {
    Pop-Location
}
