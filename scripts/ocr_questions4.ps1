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

$dir = "c:\Users\P K PRANAV\Pictures\javapractice\questions4"
$files = Get-ChildItem -Path $dir -Filter "*.png" | Sort-Object { 
    $m = [regex]::Match($_.BaseName, '\d+')
    if ($m.Success) { [long]$m.Value } else { 0 }
}

Write-Output "Processing $($files.Count) files in questions4 folder..."

$allResults = @()
$idx = 0
foreach ($f in $files) {
    $idx++
    $res = Get-OcrResult $f.FullName
    $allResults += @{
        file = $f.Name
        path = $f.FullName
        text = $res.text
        lines = $res.lines
    }
    if ($idx % 25 -eq 0 -or $idx -eq $files.Count) {
        Write-Output "Processed $idx / $($files.Count)"
    }
}

$jsonPath = "c:\Users\P K PRANAV\Pictures\javapractice\scripts\questions4_ocr.json"
$allResults | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonPath -Encoding UTF8
Write-Output "Saved OCR results to $jsonPath (Total: $($allResults.Count))"
