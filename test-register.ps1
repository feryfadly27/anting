$body = "name=Rini+Test+Parent&email=rini.test@parent.com&password=testpass123&wilayah_id=desa-id-2"

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5173/api/auth/register' `
        -Method Post `
        -ContentType 'application/x-www-form-urlencoded' `
        -Body $body
    
    Write-Host "✅ Registration successful!"
    Write-Host "User: $($response.user.name)"
    Write-Host "Email: $($response.user.email)"
    Write-Host "Wilayah ID: $($response.user.wilayah_id)"
    Write-Host "ID: $($response.user.id)"
} catch {
    Write-Host "❌ Error Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}
