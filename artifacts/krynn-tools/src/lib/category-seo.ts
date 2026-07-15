export interface CategorySEO {
  guideTitle: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const categorySeoData: Record<string, CategorySEO> = {
  pdf: {
    guideTitle: "Ultimate Guide to Online PDF Management & Editing",
    sections: [
      {
        heading: "Manage, Compress, Convert, and Sign PDFs Online Free",
        content: "Portable Document Format (PDF) files are the global standard for professional and personal document exchange. However, managing them without expensive desktop software can be challenging. Krynn Tools offers a suite of 100% free online PDF tools that run entirely in your web browser. You can merge pdf, split pdf online, rotate pdf, protect pdf with passwords, or unlock pdf constraints without sending your sensitive documents to any external servers."
      },
      {
        heading: "How to Merge PDF Files Online Free",
        content: "Whether combining monthly financial reports, school assignments, or legal agreements, you can merge pdf online free in seconds. Simply drag and drop your target PDFs into the merge workspace, reorder the page thumbnails dynamically to match your required sequence, and click export. The files are merged locally inside your browser using JavaScript WASM, ensuring absolute data privacy."
      },
      {
        heading: "Reduce File Size: Compress PDF to 100KB or 200KB",
        content: "Email clients and job portals often restrict upload sizes to 1MB or less. Our online PDF compressor allows you to compress pdf to 100kb or compress pdf to 200kb while preserving font readability and image vectors. By optimizing internal metadata, compressing high-resolution images, and removing redundant schemas, you get a clean, compact PDF that is easy to share."
      },
      {
        heading: "Convert Formats: PDF to Word, Word to PDF, and Images",
        content: "Need to make edits to a static document? Convert PDF to Word (DOCX) online to restore editable text and structures. Once finished, you can convert Word to PDF to preserve your layout across all operating systems. Additionally, extract individual pages by converting PDF to JPG, or create a presentation deck by bundling JPEG images using our JPG to PDF converter."
      },
      {
        heading: "100% Client-Side Privacy: Why Browser Processing Matters",
        content: "Most online tools upload your bank statements, tax returns, and corporate papers to their cloud servers to process them. This exposes you to severe security and privacy risks. Krynn Tools works differently. All PDF page removal, signature overlays (sign pdf online), and watermark adjustments are done directly on your local device. Your files never leave your computer."
      }
    ],
    faqs: [
      {
        question: "Is it safe to upload my confidential documents to your PDF tools?",
        answer: "Yes, because you do not upload them! All our PDF tools (including PDF merger, compressor, and signer) run locally on your browser. Your files are never sent to our servers or any third-party cloud."
      },
      {
        question: "How do I compress a PDF to less than 200KB?",
        answer: "Use our Compress PDF tool, select your file, and choose the optimized compression level. The tool reduces high-resolution graphics and redundant metadata to shrink the PDF down below 200KB or 100KB while keeping text crisp."
      },
      {
        question: "Can I sign a PDF online without paying for Adobe Acrobat?",
        answer: "Absolutely. Our Sign PDF tool lets you draw or upload a signature image, position it on any page of your document, and save the signed PDF directly to your device for free."
      },
      {
        question: "How do I delete or remove specific pages from a PDF?",
        answer: "Select the Delete PDF Pages tool, upload your document, select the page thumbnails you wish to delete, and click save. The tool immediately generates a clean PDF without those selected pages."
      }
    ]
  },
  image: {
    guideTitle: "Professional Image Optimization & Conversion in the Browser",
    sections: [
      {
        heading: "Compress, Resize, Convert, and Crop Images Offline",
        content: "Optimizing visual assets is essential for web developers, social media managers, and designers. Heavy image files slow down page load speeds, harming your SEO and user experience. Krynn Tools provides browser-based image compressor and resizing utilities to help you compress jpg, compress png, or convert files directly in your web browser. There is no software installation, and no accounts are required."
      },
      {
        heading: "Shrink Size: Compress Image to 100KB and 50KB",
        content: "Need to compress image to 50kb or 100kb for government portals or fast web loading? Select the target output format, set your visual quality slider, and compress image files instantly. The utility allows you to optimize JPEG, PNG, WebP, and SVG files while controlling resolution scales."
      },
      {
        heading: "Format Converters: JPG to PNG, PNG to JPG, HEIC, and WebP",
        content: "WebP is the modern image format recommended by Google for fast site loading. Use our image to webp converter to speed up your blog posts. You can also convert Apple's HEIC photos to JPG, convert JPG to PNG with transparency support, rasterize vector SVG files (svg to png), or convert TIFF and PSD files without needing heavy graphics software."
      },
      {
        heading: "Crop, Rotate, and Remove Background Online",
        content: "Clean up product photos or prepare profile pictures by using our crop image online and rotate tools. Looking to isolate subjects? The remove background tool helps you extract transparent PNG cutouts in one click. All filters, mirroring, and resizing are calculated locally on your graphics processor using HTML5 canvas, maintaining absolute image fidelity."
      }
    ],
    faqs: [
      {
        question: "How do I compress a JPEG image to exactly 100KB?",
        answer: "Upload your image to the Compress Image tool, adjust the quality slider to find the optimal size-to-quality ratio, and check the real-time file size estimator. Click download once it matches your target size."
      },
      {
        question: "What is the best format to use for web images?",
        answer: "WebP is highly recommended because it offers superior lossless and lossy compression compared to JPEG and PNG, leading to 30% smaller files and faster web performance."
      },
      {
        question: "How do I convert HEIC photos from my iPhone to JPG?",
        answer: "Upload your iPhone HEIC photos directly to our HEIC Converter tool. It processes the files in your browser and exports them as universally compatible JPEGs."
      },
      {
        question: "Is there a limit to how many images I can optimize?",
        answer: "No. Since all operations run locally in your web browser, there are no bandwidth restrictions, file queues, or daily usage limits."
      }
    ]
  },
  dev: {
    guideTitle: "Essential Developer Utilities for Formatting, Encoding & Mocking",
    sections: [
      {
        heading: "Quick and Safe Web Utilities for Modern Software Engineers",
        content: "Developers frequently copy and paste raw config files, API payloads, and database queries into online formatters to inspect them. However, pasting proprietary database details or API keys into third-party servers presents major security risks. Krynn Tools' Developer Tools run entirely on your client machine. You can format JSON, validate XML, encode Base64, and generate cryptographically secure UUIDs safely."
      },
      {
        heading: "Format & Beautify: JSON Formatter, XML, SQL, and HTML",
        content: "Make raw API code readable using our JSON formatter and json beautifier. The tool flags syntax errors in real-time, helping you debug payloads. You can also format XML schemas, beautify HTML documents, structure raw SQL statements, or minify CSS and JavaScript files to optimize web loading performance."
      },
      {
        heading: "Hash & Cryptographic Generators: MD5, SHA-256, Bcrypt, and UUID",
        content: "Verify data integrity or check checksums using our sha256 hash generator and md5 generator. For authentication tasks, generate secure hashes with the bcrypt generator and test them with the verifier. You can also generate v4 UUIDs, decode JSON Web Tokens (jwt decoder), or test complex match patterns in our regular expression parser (regex tester)."
      },
      {
        heading: "Data Conversion: Base64, URL Encode, and Markdown Editors",
        content: "Translate binary strings using our base64 encoder and base64 decoder. Ensure special characters are safe for HTTP headers using the url encoder. For documentation tasks, write clean README files with the markdown editor, which offers live markdown preview alongside side-by-side editing."
      }
    ],
    faqs: [
      {
        question: "Is my pasted code secure in your JSON Formatter?",
        answer: "Yes. All developer tools, including json formatting, bcrypt hashing, and base64 encoding, process text locally. Your proprietary code is never sent to our servers."
      },
      {
        question: "How do I generate a v4 UUID?",
        answer: "Open the UUID Generator, select how many IDs you need, and click copy. The generator uses the browser's cryptographically secure random number generator API."
      },
      {
        question: "What is a JWT decoder used for?",
        answer: "A JWT decoder allows you to inspect the header, payload data, and signature of a JSON Web Token to debug authentication payloads and user claims."
      }
    ]
  },
  text: {
    guideTitle: "Fast and Flexible Text Manipulation & Analysis Tools",
    sections: [
      {
        heading: "Manipulate, Sort, Format, and Analyze Plain Text",
        content: "Formatting spreadsheets, logs, and long documents manually is time-consuming. Krynn Tools provides plain-text utility tools designed to make text sorting, formatting adjustments, and duplicate removal simple. Clean up data outputs, format lists, or calculate reading statistics in one click."
      },
      {
        heading: "Analyze Text: Word Counter, Character Counter, and Line Sorters",
        content: "Track essay constraints or character limitations for social media posts using our word counter and character counter. The text sorter allows you to sort lists alphabetically or numerically, reverse character lists (text reverser), or extract duplicate records instantly using the remove duplicate lines utility."
      },
      {
        heading: "Text Case Converters: UPPERCASE, Title Case, and Slug Generators",
        content: "Quickly change header text casing using the case converter. Switch blocks of text to uppercase, lowercase, sentence case, or convert article titles into SEO-friendly paths using the slug generator. You can also compare file changes side-by-side using our diff checker."
      }
    ],
    faqs: [
      {
        question: "How do I remove duplicate lines from a text list?",
        answer: "Paste your list into the Remove Duplicate Lines tool, select your options (case sensitivity, preserving order), and copy the clean, deduplicated text."
      },
      {
        question: "What text stats are calculated by your word counter?",
        answer: "The tool calculates total words, characters, characters excluding spaces, total sentences, paragraph count, and average reading time."
      }
    ]
  },
  security: {
    guideTitle: "Client-Side Cryptographic & Password Generation Tools",
    sections: [
      {
        heading: "Generate Secure Passwords, Bcrypt Hashes, and SHA-256 Strings",
        content: "Security is non-negotiable. Creating strong credentials and testing cryptographic hashes should be done without exposing data to the cloud. Krynn Tools provides security-grade utilities that execute exclusively on your computer, ensuring zero data exposure."
      },
      {
        heading: "Password Strength Checker & Secure Generators",
        content: "Avoid using simple credentials by generating strong passwords with customizable parameters (symbols, numbers, custom length). Check your existing password vulnerability using our password strength checker, which evaluates entropy, dictionary patterns, and structural complexity."
      }
    ],
    faqs: [
      {
        question: "Is it safe to generate passwords online?",
        answer: "It is safe on Krynn Tools because the password generator operates entirely client-side using secure cryptographic random APIs. No password is ever transmitted or stored."
      },
      {
        question: "What is Bcrypt used for?",
        answer: "Bcrypt is an adaptive hashing function used to store user passwords securely. It includes a salt parameter to protect database credentials against rainbow table attacks."
      }
    ]
  },
  calculators: {
    guideTitle: "Practical Mathematical, Percentage & Health Calculators",
    sections: [
      {
        heading: "Calculate Percentages, BMI, Age, and EMI Instantly",
        content: "Need to make quick calculations? Our calculators category provides tools to evaluate financial values, health metrics, and conversion rates without distracting popups or paywalls."
      },
      {
        heading: "Health & Financial Formulas",
        content: "Track fitness goals with the BMI calculator, check loan parameters using the EMI calculator, or solve math ratios with the percentage calculator. Our calculations are fast, responsive, and render immediately on mobile and desktop."
      }
    ],
    faqs: [
      {
        question: "How is BMI calculated?",
        answer: "Body Mass Index (BMI) is calculated by dividing weight in kilograms by the square of height in meters, providing a general categorization of body weight."
      }
    ]
  },
  design: {
    guideTitle: "Visual Web Design Helpers for CSS & Colors",
    sections: [
      {
        heading: "Generate CSS Gradients, Box Shadows, and Palettes",
        content: "Designing web interfaces requires fast, visual feedback. Use our design tools to test color combinations, generate box shadows, customize gradients, and copy clean CSS code instantly."
      }
    ],
    faqs: [
      {
        question: "Can I generate linear and radial CSS gradients?",
        answer: "Yes. The CSS Gradient Generator lets you customize gradient colors, angles, and color stops, generating copyable CSS code instantly."
      }
    ]
  },
  "ai-writing": {
    guideTitle: "AI-Powered Writing & Grammar Assistants",
    sections: [
      {
        heading: "Summarize Text, Write Essays, and Correct Grammar",
        content: "Boost your writing productivity with AI-driven assistants. Krynn Tools' AI Writing category helps you clean up drafts, check grammar errors, write essay outlines, or summarize long articles in seconds."
      }
    ],
    faqs: [
      {
        question: "How does the AI Summarizer work?",
        answer: "It uses natural language processing models to extract the main points of your pasted text and generate a concise summary."
      }
    ]
  },
  "social-media": {
    guideTitle: "Optimization Tools for Social Media Creators",
    sections: [
      {
        heading: "Resize Images for Socials and Validate Usernames",
        content: "Managing multiple social channels requires matching diverse asset dimensions. Krynn Tools helps you resize images to match dimensions for Instagram, X, LinkedIn, and Facebook, and validate account usernames."
      }
    ],
    faqs: [
      {
        question: "Does the username checker verify availability?",
        answer: "Yes. It checks profile paths across major platforms to see if a specific username handle is available or taken."
      }
    ]
  },
  misc: {
    guideTitle: "Utility Tools: QR Codes, Barcodes, and Timestamps",
    sections: [
      {
        heading: "Generate QR Codes, Barcodes, and Convert Timestamps",
        content: "Our miscellaneous category includes daily utility scripts. Generate custom QR codes for URLs and contact details, generate barcodes, or convert Unix timestamps to readable calendar dates."
      }
    ],
    faqs: [
      {
        question: "Do your QR codes expire?",
        answer: "No. The QR Code Generator creates static QR codes that contain your raw URL or text directly, meaning they work forever and have no watermark or expiration."
      }
    ]
  }
};
