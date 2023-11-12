npm run build:prod
aws s3 cp dist/wof-ui/browser/ s3://wof.rtrydev.com/ --recursive
aws cloudfront create-invalidation --distribution-id E37PICXG5XFXAN --paths "/*"
