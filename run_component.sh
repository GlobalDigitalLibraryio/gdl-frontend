#!/bin/sh

function setup_environment {

    for v in $(aws apigateway --region eu-central-1 get-rest-apis | jq '.items[] | .name + "=https://" + .id + ".execute-api.eu-central-1.amazonaws.com/prod"'); do
       key=$( echo "$v" |cut -d'=' -f1 )
       key=${key//-/_}
       key=$( echo "$key" | tr '[:lower:]' '[:upper:]' )
       value=$( echo "$v" |cut -d'=' -f2 )
       eval "export ${key//"PROD_"/}=$value";
    done

    if [ $? -ne 0 ]; then
        echo "Failed to set up environment!" >&2;
        exit 1;
    fi
}


if [ $GDL_ENVIRONMENT != "local" ]; then
    setup_environment
fi

eval $@