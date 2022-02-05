import Link from 'next/link';


function Footer(){
  return(
    <footer className="bg-sky-800 p-8 text-center text-white">
    <div className="container p-6">
      <div>
        <p className="flex justify-center items-center">
          <span className="mr-4">Join My Test DAO App</span>
          <Link type="button" className="inline-block px-6 py-2 border-2 border-white text-white font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out" href="https://minter-app-ravinthiranpartheepan1407.vercel.app/">
            DAO
            </Link>
        </p>
      </div>
    </div>

    <div className="text-center p-4">
      © 2021 Copyright:
      <Link className="text-white" href="/">Developed By Ravinthiran Partheepan</Link>
    </div>
    </footer>
  )
}

export default Footer;
