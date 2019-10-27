cd src/frontend

if npm run e2e ; then
	echo "e2e success"
	if npm run build-prod ; then
		echo "package success"
		aws s3 rm s3://www.haziba.co.uk/knaves-log --recursive
		aws s3 cp ./dist/frontend/ s3://www.haziba.co.uk/knaves-log --recursive --acl public-read --exclude '*.js'
		aws s3 cp ./dist/frontend/ s3://www.haziba.co.uk/knaves-log --recursive --content-type text/javascript --acl public-read --exclude '*' --include '*.js'
		echo "upload complete"
	else
		echo "package failure"
	fi
else
	echo "e2e failure"
fi
	

cd ../../
