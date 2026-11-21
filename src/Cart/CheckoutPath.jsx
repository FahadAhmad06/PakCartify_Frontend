import { AccountBalance, LibraryAddCheck, LocalShipping } from "@mui/icons-material";
import React from "react";

function CheckoutPath({ activepath }) {

  const path = [
    {
      label: "Shipping",
      sub: "Address",
      icon: <LocalShipping />
    },
    {
      label: "Confirm",
      sub: "Order",
      icon: <LibraryAddCheck />
    },
    {
      label: "Payment",
      sub: "Secure",
      icon: <AccountBalance />
    }
  ];


  return (
    <div className="w-full pt-24 pb-4 px-4 bg-gradient-to-b from-emerald-50 to-white pt-10 mt-10">

      <div className="
        max-w-5xl mx-auto
        bg-white/80 backdrop-blur-xl
        shadow-xl
        border border-gray-100
        rounded-3xl
        px-5 sm:px-10 py-8
      ">

        <div className="flex items-center justify-center">

          {path.map((item, index) => {

            const active = activepath === index;
            const completed = activepath > index;


            return (
              <React.Fragment key={index}>


                {/* Step */}
                <div className="flex flex-col items-center relative">


                  <div
                    className={`
                      relative
                      flex items-center justify-center
                      w-14 h-14 sm:w-16 sm:h-16
                      rounded-full
                      border-2
                      transition-all duration-500

                      ${
                        completed
                        ?
                        "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
                        :
                        active
                        ?
                        "bg-white border-emerald-600 text-emerald-600 scale-110 shadow-xl shadow-emerald-100"
                        :
                        "bg-gray-100 border-gray-300 text-gray-400"
                      }
                    `}
                  >

                    {item.icon}


                    {
                      active && (
                        <span className="
                          absolute
                          inset-0
                          rounded-full
                          border-2
                          border-emerald-400
                          animate-ping
                          opacity-40
                        ">
                        </span>
                      )
                    }


                  </div>



                  <div className="text-center mt-3">

                    <h3
                      className={`
                        text-sm sm:text-base font-bold

                        ${
                          active
                          ?
                          "text-emerald-600"
                          :
                          completed
                          ?
                          "text-gray-700"
                          :
                          "text-gray-400"
                        }
                      `}
                    >
                      {item.label}
                    </h3>


                    <p className="text-xs text-gray-400">
                      {item.sub}
                    </p>

                  </div>


                </div>



                {/* Connector */}
                {
                  index !== path.length - 1 && (

                    <div className="
                      flex items-center
                      mx-3 sm:mx-8
                      mb-8
                    ">

                      <div
                        className={`
                          h-1
                          w-12 sm:w-28
                          rounded-full
                          transition-all duration-500

                          ${
                            activepath > index
                            ?
                            "bg-gradient-to-r from-emerald-500 to-green-400"
                            :
                            "bg-gray-200"
                          }
                        `}
                      />

                    </div>

                  )
                }



              </React.Fragment>
            )

          })}


        </div>


      </div>

    </div>
  );
}

export default CheckoutPath;