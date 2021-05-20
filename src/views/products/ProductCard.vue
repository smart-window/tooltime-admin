<template>
  <div class="card overflow-hidden">
    <div :class="$style.new">New</div>
    <div class="card-body">
      <div :class="$style.image" class="border-bottom height-250 mb-3">
        <img class="img-fluid" :src="imageArray[0]" :alt="name" />
      </div>
      <div>
        <a href="javascript:void(0);" class="text-blue font-size-18">
          {{ name }}
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'KitGeneral16',
  props: ['isNew', 'isFavorite', 'imagesStr', 'name', 'price', 'oldPrice'],
  data: function () {
    return {
      favorite: this.isFavorite,
    }
  },
  computed: {
    imageArray() {
      return this.imagesStr.split(',')
    },
  },
  methods: {
    toggleFavorite: function (event) {
      event.preventDefault()
      this.favorite = !this.favorite
    },
  },
}
</script>
<style lang="scss" module>
@import './ProductCard.module.scss';
</style>
