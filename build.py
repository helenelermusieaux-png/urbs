"""Génère index.html (page hébergeable) à partir de app.artifact.html."""
s=open('app.artifact.html').read()
i=s.index('</style>')+len('</style>')
head,body=s[:i],s[i:]
out=('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
 '<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#2E8C50">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="Clairière">\n<meta name="apple-mobile-web-app-status-bar-style" content="default">\n<link rel="icon" href="favicon.png">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
 '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>\n'
 +head+'\n</head>\n<body>'+body+'\n<script>if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}))</script>\n</body>\n</html>\n')
open('index.html','w').write(out)
