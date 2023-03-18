export { default } from "next-auth/middleware";
import { menuItems } from 'components/SideMenu'

const paths = menuItems.map((item) => `${item.link}/:path*`)

export const config = { matcher: paths }