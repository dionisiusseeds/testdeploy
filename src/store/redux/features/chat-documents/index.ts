import { type MetadataFileInfo } from '@/utils/interfaces/chat.interface';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FileMetadataState {
  cache: Record<string, MetadataFileInfo>;
}

const initialState: FileMetadataState = {
  cache: {}
};

const FileMetadataSlice = createSlice({
  name: 'fileMetadata',
  initialState,
  reducers: {
    setFileMetadata: (
      state,
      action: PayloadAction<{ url: string; metadata: MetadataFileInfo }>
    ) => {
      state.cache[action.payload.url] = action.payload.metadata;
    }
  }
});

export const { setFileMetadata } = FileMetadataSlice.actions;
export default FileMetadataSlice.reducer;
