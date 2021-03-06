dotnet publish -o ./publish
aws cloudformation package --template-file template.yaml --s3-bucket take-my-dog-please --output-template-file template-output.yaml --region eu-west-1
aws cloudformation deploy --template-file template-output.yaml --stack-name knaves-log --capabilities CAPABILITY_IAM
