[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
Function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}
[Windows.Graphics.Imaging.BitmapDecoder,Windows.Foundation.UniversalApiContract,ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine,Windows.Foundation.UniversalApiContract,ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile,Windows.Foundation.UniversalApiContract,ContentType=WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

function Get-OcrResult($filePath) {
    try {
        $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($filePath)) ([Windows.Storage.StorageFile])
        $stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
        $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
        $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
        $ocrResult = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
        
        $lines = @()
        foreach ($line in $ocrResult.Lines) {
            $lines += $line.Text
        }
        return @{
            text = $ocrResult.Text
            lines = $lines
        }
    } catch {
        return @{
            text = ""
            lines = @()
        }
    }
}

$relevant = Import-Clixml "c:\Users\P K PRANAV\Pictures\javapractice\scripts\screenshots_relevant.xml"
Write-Output "Processing $($relevant.Count) relevant files from Pictures\Screenshots..."

$allResults = @()
$idx = 0
foreach ($item in $relevant) {
    $idx++
    $filePath = Join-Path "c:\Users\P K PRANAV\Pictures\Screenshots" $item.File
    $res = Get-OcrResult $filePath
    $allResults += @{
        file = $item.File
        path = $filePath
        text = $res.text
        lines = $res.lines
    }
    if ($idx % 25 -eq 0) {
        Write-Output "Processed $idx / $($relevant.Count)"
    }
}

$jsonPath = "c:\Users\P K PRANAV\Pictures\javapractice\scripts\screenshots_ocr.json"
$allResults | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonPath -Encoding UTF8
Write-Output "Saved OCR results to $jsonPath (Total: $($allResults.Count))"
