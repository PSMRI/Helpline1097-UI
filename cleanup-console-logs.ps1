# Console.log Cleanup Script for Helpline1097-UI
# Rules:
#   1. Remove all active console.log() lines (debug logging)
#   2. Convert error-path console.log(error/err/e) to console.error()
#   3. Remove commented-out console.log lines (dead code)

$files = Get-ChildItem -Recurse -Include "*.ts" -Path "src\app"
$totalRemoved = 0
$totalConverted = 0
$totalDeadCode = 0
$filesModified = 0

foreach ($file in $files) {
    $lines = [System.IO.File]::ReadAllLines($file.FullName)
    $newLines = [System.Collections.Generic.List[string]]::new()
    $fileModified = $false
    $removed = 0
    $converted = 0
    $deadCode = 0

    foreach ($line in $lines) {
        # Rule 3: Remove commented-out console.log lines (dead code)
        if ($line -match '^\s*//+\s*console\.log') {
            $deadCode++
            $fileModified = $true
            continue
        }

        # Rule 2: Convert error-path console.log to console.error
        # Matches: console.log(error), console.log(err), console.log(e)
        if ($line -match '^\s*console\.log\s*\(\s*(error|err)\s*\)\s*;?\s*$') {
            $newLine = $line -replace 'console\.log', 'console.error'
            $newLines.Add($newLine)
            $converted++
            $fileModified = $true
            continue
        }

        # Rule 1: Remove active console.log lines
        if ($line -match '^\s*console\.log\s*\(') {
            $removed++
            $fileModified = $true
            continue
        }

        $newLines.Add($line)
    }

    if ($fileModified) {
        [System.IO.File]::WriteAllLines($file.FullName, $newLines.ToArray())
        $filesModified++
        $totalRemoved += $removed
        $totalConverted += $converted
        $totalDeadCode += $deadCode
        Write-Host "$($file.Name): -$removed removed, ~$converted converted, -$deadCode dead code"
    }
}

Write-Host ""
Write-Host "=== Summary ==="
Write-Host "Files modified: $filesModified"
Write-Host "Debug logs removed: $totalRemoved"
Write-Host "Error logs converted to console.error: $totalConverted"
Write-Host "Dead commented-out logs removed: $totalDeadCode"
Write-Host "Total lines eliminated: $($totalRemoved + $totalDeadCode)"
