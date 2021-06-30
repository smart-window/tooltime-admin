<template>
  <div>
    <div class="ant-upload-preview">
      <div style="width: 100%">
        <a-upload
          name="avatar"
          :showUploadList="false"
          :beforeUpload="beforeUpload"
          :customRequest="function () {}"
          @change="handleChange"
        >
          <a-icon type="cloud-upload-o" class="upload-icon" />
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="imageUrl" width="180px" height="180px" />
        </a-upload>
      </div>
      <!-- modal -->
    </div>
    <cropper-modal ref="CropperModal" @ok="handleCropperSuccess"></cropper-modal>
  </div>
</template>
<script>
import CropperModal from './CropperModal'

export default {
  components: {
    CropperModal,
  },
  props: {
    // Image Format
    imgFormat: {
      type: Array,
      default: function () {
        return ['image/jpeg']
      },
    },
    // Image size
    imgSize: {
      type: Number,
      default: 2,
    },
    // Picture cutting configuration
    options: {
      type: Object,
      default: function () {
        return {
          autoCropWidth: 180,
          autoCropHeight: 180,
        }
      },
    },
    // Echo the image path
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      imageUrl: '',
    }
  },
  watch: {
    value: {
      handler(val) {
        this.imageUrl = val || ''
      },
      immediate: true,
    },
  },

  methods: {
    // Select file from local
    handleChange(info) {
      const { options } = this
      this.getBase64(info.file.originFileObj, (imageUrl) => {
        const target = Object.assign({}, options, {
          img: imageUrl,
        })
        this.$refs.CropperModal.edit(target)
      })
    },
    // Before uploading format and size verification
    beforeUpload(file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('Please upload a picture')
        return false
      }
    },
    // File object after successful cropping
    handleCropperSuccess(data) {
      // Perform picture upload action
      // Simulate a 2000 millisecond delay for backend requests
      const that = this
      // Echo the returned data
      that.imageUrl = window._CONFIG['dot-notation'] + '/' + data
      that.avatar = data
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-upload-wrapper {
  height: 180px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
