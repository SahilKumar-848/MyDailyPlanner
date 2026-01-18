Write-Host "Testing Signup..."
$signupBody = @{
    email    = "user@test.com"
    password = "password123"
    username = "TestUser"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/signup" -Method Post -Body $signupBody -ContentType "application/json"
    Write-Host "Signup Success: $($response.message)"
}
catch {
    Write-Host "Signup Failed: $($_.Exception.Message)"
}

Start-Sleep -Seconds 1

Write-Host "Testing Login..."
$loginBody = @{
    email    = "user@test.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Login Success. Token: $($response.token)"
}
catch {
    Write-Host "Login Failed: $($_.Exception.Message)"
}
