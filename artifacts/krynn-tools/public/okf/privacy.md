# Krynn Tools — Privacy & Security Architecture

## Client-Side Isolation Guarantee
Unlike traditional SaaS platforms that upload files to cloud servers or S3 buckets for processing, **Krynn Tools operates as a local web app running in your browser execution context**.

### Technical Safeguards:
- **Zero Server Uploads**: Files dropped into PDF or Image tools stay inside browser memory DOM/Blob storage.
- **WebAssembly & Web APIs**: Heavy calculations (PDF parsing, image resizing, hashing) execute via client JS engines and WASM modules.
- **No Analytics Fingerprinting**: No sensitive data or payload logging is collected or transmitted.
- **AI Writing Privacy**: AI writing requests send prompt text to a stateless serverless proxy for Google Gemini inference. Input and generated output are returned in real-time and never logged or stored on disk.
