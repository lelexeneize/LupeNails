$token = gcloud auth print-access-token --project=lele-app-494122 2>&1 | Select-Object -Last 1

# Enable Email/Password auth
$body = '{"signIn":{"email":{"enabled":true,"passwordRequired":false}}}'
$result = curl.exe -s -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/lele-app-494122/config?updateMask=signIn.email" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d $body 2>&1
Write-Output "=== Email auth ==="
Write-Output $result

# Enable Google auth
$body2 = '{"signIn":{"google":{"enabled":true}}}'
$result2 = curl.exe -s -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/lele-app-494122/config?updateMask=signIn.google" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d $body2 2>&1
Write-Output "=== Google auth ==="
Write-Output $result2

# Add authorized domain
$body3 = '{"authorizedDomains":["localhost","lupenails.vercel.app","lupenails-2b2gxrg34-leandroballan-5294s-projects.vercel.app"]}'
$result3 = curl.exe -s -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/lele-app-494122/config?updateMask=authorizedDomains" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d $body3 2>&1
Write-Output "=== Authorized domains ==="
Write-Output $result3
