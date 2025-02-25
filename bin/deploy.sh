ROOT_PATH="$(pwd)/$(dirname $0)/.."

printf "*** Building project ***\n"
rm -rf dist
npm run build || exit
cp service-account-dev.json dist || exit
cp service-account-dev.json dist/src || exit
cp service-account-dev.json dist/src/users || exit

printf "*** Building general layer ***\n"
cd "$ROOT_PATH/layers/general/nodejs" || exit
npm install --omit=dev || exit

printf "*** Terraform fmt, validate and deploy ***\n"
cd "$ROOT_PATH" || exit
docker compose run terraform fmt
docker compose run terraform validate || exit
docker compose run terraform apply -auto-approve || exit

printf  "*** Clean up zip files ***\n"
cd "$ROOT_PATH" || exit
rm -f dist/lambda.zip layers/general/layer.zip

printf "\n*** Done ***\n"
cd "$ROOT_PATH" || exit
