export type FileUploadConfig = {
  batch_count_limit: number
  image_file_size_limit?: number | string // default is 10MB
  file_size_limit: number // default is 15MB
  audio_file_size_limit?: number // default is 50MB
  video_file_size_limit?: number // default is 100MB
  workflow_file_upload_limit?: number // default is 10
  file_upload_limit: number // default is 5
}