Certification Upload Flow (docUrl)

The backend expects a public URL to a certification document (docUrl). There is no binary upload endpoint by default.

Approach 1: Client to Cloud (recommended)
- Upload from the frontend to your storage provider (Cloudinary, S3, Firebase).
- Obtain the public URL.
- Call PATCH /api/caregivers/:id/upload-doc with body: { "docUrl": "https://..." } (auth, role provider).

Approach 2: Server upload endpoint (optional)
- Add an endpoint using multer and your storage SDK that returns a URL, then send that URL to the same PATCH endpoint above.

Validation expectations
- Allowed types: PDF, DOC, DOCX, JPG, PNG (enforce on client or upload service).
- Max size: 5–10 MB (enforce at upload time).

Admin verification
- List unverified: GET /api/admin/careproviders/unverified
- Verify: PATCH /api/caregivers/:id/verify (role admin)
- Flag: PATCH /api/caregivers/:id/flag (role admin)

Registration response example
{
  "userId": 12,
  "role": "provider",
  "careproviderId": 34,
  "message": "Provider registered successfully (awaiting admin verification)"
}


