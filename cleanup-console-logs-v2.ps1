# Console.log Cleanup Script v2
# More surgical approach to avoid breaking multi-line statements

$files = Get-ChildItem -Recurse -Include "*.ts" -Path "src\app"
$totalRemoved = 0
$totalConverted = 0
$totalDeadCode = 0
$filesModified = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $modified = $false

    # Rule 3: Remove commented-out console.log lines (single line)
    # Match lines like // console.log(...) or //console.log(...)
    $newContent = $content -replace '(?m)^\s*//+\s*console\.log\(.*?\);?\s*$', ''
    if ($newContent -ne $content) {
        $totalDeadCode += ([regex]::Matches($content, '(?m)^\s*//+\s*console\.log\(.*?\);?\s*$')).Count
        $content = $newContent
        $modified = $true
    }

    # Rule 2: Convert error-path console.log to console.error (single line only for safety)
    $newContent = $content -replace '(?m)^(\s*)console\.log\s*\(\s*(error|err|e)\s*\)\s*;?\s*$', '$1console.error($2);'
    if ($newContent -ne $content) {
        $totalConverted += ([regex]::Matches($content, '(?m)^(\s*)console\.log\s*\(\s*(error|err|e)\s*\)\s*;?\s*$')).Count
        $content = $newContent
        $modified = $true
    }

    # Rule 1: Remove active console.log lines (single line only for safety)
    $newContent = $content -replace '(?m)^\s*console\.log\(.*?\);?\s*$', ''
    if ($newContent -ne $content) {
        $totalRemoved += ([regex]::Matches($content, '(?m)^\s*console\.log\(.*?\);?\s*$')).Count
        $content = $newContent
        $modified = $true
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        $filesModified++
    }
}

Write-Host "=== Summary v2 ==="
Write-Host "Files modified: $filesModified"
Write-Host "Single-line Debug logs removed: $totalRemoved"
Write-Host "Error logs converted: $totalConverted"
Write-Host "Dead logs removed: $totalDeadCode"
