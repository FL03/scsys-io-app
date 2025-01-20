/*
    Appellation: webdata <lib>
    Contrib: FL03 <jo3mccain@icloud.com>
*/
import { placeholders } from "./placeholders";
import { Address } from "@/types";

export const brandEndpoint = (path: string) => "https://www.theboudincompany.com/" + path;

export const brand = {
    name: "The Boudin Company",
    logo: "https://i0.wp.com/theboudincompany.com/wp-content/uploads/2023/04/forklogo.png?resize=150%2C150&ssl=1",
    homepage: brandEndpoint(""),
}

export const bigChicken = {
  homepage: 'https://www.bigchicken.com',
  logo: 'https://images.squarespace-cdn.com/content/v1/623a789db6deb928c0819eeb/f6f12b5b-f4aa-4aea-9039-3ed5110cb5ac/Big+Chicken_LG_RGB_TM-01.png?format=1500w',
  name: 'Big Chicken',
  locations: [
    {
      id: 'tbc-tx-rosenberg',
      slug: 'tbc',
      name: 'The Boudin Company',
      homepage: brandEndpoint('/richmond-tx'),
      address: new Address({
        address: '3415 FM 762 Rd #100',
        city: 'Richmond',
        state: 'TX',
        zip_code: '77469',
      }),
      phone: {
        display: '(281) 738-3211',
        tel: '2817383211',
      },
      hours: [
        { day: 'Monday', open: '11:00 AM', close: '9:00 PM' },
        { day: 'Tuesday', open: '11:00 AM', close: '9:00 PM' },
        { day: 'Wednesday', open: '11:00 AM', close: '9:00 PM' },
        { day: 'Thursday', open: '11:00 AM', close: '9:00 PM' },
        { day: 'Friday', open: '11:00 AM', close: '9:00 PM' },
        { day: 'Saturday', open: '11:00 AM', close: '9:00 PM' },
        { day: 'Sunday', open: '11:00 AM', close: '9:00 PM' },
      ],
    },
  ],
};

export const users = [
    {
        avatar: "https://avatars.githubusercontent.com/u/92560746?v=4",
        email: "joe.mccain@scattered-systems.com",
        role: "codeowner",
        phone: 8325449562,
        name: "Joe McCain III",
        username: "pzzld",
        socials: [
            {
                name: "GitHub",
                url: "https://github.com/FL03"
            }
        ],
    }
]



export const appdata = {
    description: "A staging application demonstrating various aspects of the pzzld platform",
    title: "Staging",
    placeholders: placeholders,
}

export default appdata;