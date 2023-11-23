import React from "react";
import { TailSpin } from "react-loader-spinner";
import { useNavigation } from "react-router-dom";

export default function PageLoader() {

    const navigation = useNavigation();

    function renderLoader() {
        
        if (navigation.state === "submitting" || navigation.state === "loading") {
            setTimeout(() => {
                return ( 
                    <div className="page-loader--container">
                        <TailSpin
                            height="80"
                            width="80"
                            color="#007FFF"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />  
                        <h2 className="page-loader--heading">Please, wait few seconds. </h2>  
                    </div>
                )
            }, 3000);
        } else {
            return null;
        }
            
        
    }

    return (
       renderLoader()
    )
}