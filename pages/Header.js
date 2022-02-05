import Link from 'next/link';

function Header(){
  return(
    <ul className="flex bg-sky-800 p-8 text-white">
  <li className="flex-1 mr-2">
    <Link className="text-center block rounded hover:border-gray-200 text-white hover:bg-gray-200 py-2 px-4" href="https://eth-gas-tracker-xi.vercel.app/">Gas Tracker</Link>
  </li>
  <li className="flex-1 mr-2">
    <Link className="text-center block rounded hover:border-gray-200 text-white hover:bg-gray-200 py-2 px-4" href="https://minter-app-ravinthiranpartheepan1407.vercel.app/">DAO</Link>
  </li>
  <li className="flex-1 mr-2">
    <Link className="text-center bg-sky-400 block rounded hover:border-gray-200 text-white hover:bg-gray-200 py-2 px-4" href="https://dapp-white-list-ravi.vercel.app/">WhiteList</Link>
  </li>
  <li className="flex-1 mr-2">
    <Link className="text-center bg-sky-400 block rounded hover:border-gray-200 text-white hover:bg-gray-200 py-2 px-4" href="#">ICO</Link>
  </li>
  <li className="text-center flex-1">
    <Link className="text-center block rounded hover:border-gray-200 text-white hover:bg-gray-200 py-2 px-4" href="#">DeFi</Link>
  </li>
  <li className="text-center flex-1">
    <Link className="text-center block rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4" href="/">Home</Link>
  </li>

</ul>
  )
}

export default Header;
