cd src/frontend

npm run build-prod
aws s3 rm s3://www.haziba.co.uk/knaves-log --recursive
aws s3 cp ./dist/frontend/ s3://www.haziba.co.uk/knaves-log --recursive --acl public-read --exclude '*.js'
aws s3 cp ./dist/frontend/ s3://www.haziba.co.uk/knaves-log --recursive --content-type text/javascript --acl public-read --exclude '*' --include '*.js'

cd ../../
