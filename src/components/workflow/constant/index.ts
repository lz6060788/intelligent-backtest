export * from './nodes';


export const DEFAULT_FILE_UPLOAD_SETTING = {
  allowed_file_upload_methods: ['local_file', 'remote_url'],
  max_length: 5,
  allowed_file_types: ['image'],
  allowed_file_extensions: [],
}