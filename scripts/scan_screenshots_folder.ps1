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

function Get-OcrText($filePath) {
    try {
        $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($filePath)) ([Windows.Storage.StorageFile])
        $stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
        $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
        $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
        $ocrResult = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
        return $ocrResult.Text
    } catch {
        return ""
    }
}

$files = Get-ChildItem -Path "c:\Users\P K PRANAV\Pictures\Screenshots" -Filter "Screenshot (*).png"
Write-Output "Scanning $($files.Count) screenshots in Pictures\Screenshots..."

$relevant = @()
foreach ($f in $files) {
    $txt = Get-OcrText $f.FullName
    if ($txt -match 'examly' -or $txt -match 'Amrita' -or $txt -match 'Single File Programming' -or $txt -match 'COD \(\d+\)' -or $txt -match 'Problem Statement' -or $txt -match 'Java') {
        $relevant += [PSCustomObject]@{
            File = $f.Name
            Snippet = if ($txt.Length -gt 120) { $txt.Substring(0, 120) } else { $txt }
        }
        Write-Output "Found: $($f.Name)"
    }
}

Write-Output "Total relevant found in Pictures\Screenshots: $($relevant.Count)"
$relevant | Export-Clixml "c:\Users\P K PRANAV\Pictures\javapractice\scripts\screenshots_relevant.xml"
