import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build:{
    chunkSizeWarningLimit:500000,
  },
  publicPath:'../../',
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  //assetsInclude: 
	  //['./src/assets/Vinyl_disc.glb',
	   //'./src/assets/player(1).glb']
})
