# Final multi-line cleanup script
$files = @(
    "src\app\alerts-notifications\alerts-notifications.component.ts",
    "src\app\dashboard-user-id\dashboardUserId.component.ts",
    "src\app\closure\closure.component.ts",
    "src\app\directives\stringValidator.directive.ts",
    "src\app\call-statistics\call-statistics.component.ts",
    "src\app\quality-audit\quality-audit.component.ts",
    "src\app\beneficiary-registration\beneficiary-registration.component.ts",
    "src\app\innerpage\innerpage.component.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path "c:\github\OPEN-SOURCE-PROJECTS\Helpline1097-UI" $file
    if (Test-Path $fullPath) {
        $content = [System.IO.File]::ReadAllText($fullPath)
        # Match console.log( ... ) across multiple lines
        # This regex is conservative: it matches console.log( followed by anything that doesn't contain a closing brace { (to avoid over-matching)
        # and ends with );
        $newContent = $content -replace '(?ms)^\s*console\.log\s*\([^\{]*?\)\s*;?', ''
        
        # Also clean up the specific case in beneficiary-registration.component.ts
        $newContent = $newContent -replace "console\.log\('Registered number will be used'\); // Registered number will be used", ""

        if ($newContent -ne $content) {
            [System.IO.File]::WriteAllText($fullPath, $newContent)
            Write-Host "Modified: $file"
        }
    }
}
