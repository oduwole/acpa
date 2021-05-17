using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AllianzCPA
{
    public static class Receipient
    {
        public static string Get(string types, string product)
        {
            if(types.Equals("Claims"))
            {
                if (product.Contains("Death"))
                {
                    return "azng_lifeclaims@allianz.com";
                } else if (product.Contains("Motor"))
                {
                    return "azng_motorclaims@allianz.com";
                }else
                {
                    return "azng_nonmotorclaims@allianz.com";
                }
            }
            else if(types.Equals("Proposals"))
            {
                return "info@allianz.ng";
                /*if (product.Contains("Death") || product.Contains("Life"))
                {
                    return "azng_lifeclaims@allianz.com";
                }
                else if (product.Contains("Motor"))
                {
                    return "azng_motorclaims@allianz.com";
                }
                else
                {
                    return "azng_nonmotorclaims@allianz.com";
                }*/
            }
            return "info@allianz.ng";
        }
    }
}
