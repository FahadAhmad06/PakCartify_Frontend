import React from 'react';
import {Phone, Mail, GitHub, Instagram, YouTube, LinkedIn } from '@mui/icons-material';

function Footer() {
  return (
    <footer className="bg-[#021A10] text-white py-8 shadow-[0px_-4px_10px_rgba(0,0,0,0.1)]  w-full">

      {/* Footer Container */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 max-w-[1200px] mx-auto px-4 ">

        {/* Contact Section */}
        <div className="flex-1 min-w-[250px] mb-8 md:mb-0 md:mr-8 text-center md:text-left">
          <h3 className="text-[1.4rem] font-semibold mb-4 text-white">
            Contact Us
          </h3>

          <p className="flex items-center justify-center md:justify-start gap-2 text-base text-gray-300 leading-6 mb-3 "><Phone fontSize='small' />Phone : +92 328 9047057
          </p>

          <p className="flex items-center justify-center md:justify-start gap-2 text-base text-gray-300 leading-6 mb-3">
            <Mail fontSize="small" />
            Email : fahadahmad0621@gmail.com
          </p>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-center gap-6 flex-1 min-w-[250px] mb-8 md:mb-0">
          <h3 className="text-[1.4rem] font-semibold mb-4 text-white">
            Follow Me
          </h3>

          <div className="flex gap-4 justify-center">
            <a href="https://github.com/FahadAhmad06" target="_blank" rel="noopener noreferrer">
              <GitHub
                className=" text-[1.8rem] md:text-[2rem] text-white transition-all duration-300 hover:text-black hover:bg-white rounded-md hover:scale-110 cursor-pointer
                "
              />
            </a>

            <a href="https://www.linkedin.com/in/fahad0621/" target="_blank" rel="noopener noreferrer" >
              <LinkedIn className="text-[1.8rem] md:text-[2rem] text-white transition-all duration-300 hover:text-[#0077B5] hover:bg-white rounded-md hover:scale-110 cursor-pointer"/>
            </a>

            <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" >
              <YouTube className="text-[1.8rem] md:text-[2rem] text-white transition-all duration-300 hover:text-red-600 hover:bg-white rounded-md hover:scale-110 cursor-pointer "/>
            </a>

            <a href="https://www.instagram.com/f.a.h.a.d.06/" target="_blank" rel="noopener noreferrer" >
              <Instagram className=" text-[1.8rem] md:text-[2rem] text-white transition-all duration-300 hover:bg-linear-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcaf45] rounded-md hover:scale-110 cursor-pointer " />
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className="flex-1 min-w-[250px] md:mb-0 text-center md:text-left">
          <h3 className="text-[1.4rem] font-semibold mb-4 text-white ">
            About PakCartify
          </h3>

          <p className="text-base text-gray-300 leading-6 mb-3 ">
            PakCartify is your trusted online shopping destination, offering quality products at affordable prices. We are committed to providing a secure, convenient, and enjoyable shopping experience with fast delivery and excellent customer support across Pakistan.
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-8 pt-6 border-t border-gray-600">
        <p className="m-0 text-base font-normal text-gray-300">
          © {new Date().getFullYear()} PakCartify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;