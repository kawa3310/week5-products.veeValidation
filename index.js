import userProductModal from "./userProductModal.js";

// 全部規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// 套用
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

let url = 'https://vue3-course-api.hexschool.io/v2';
let path = 'reirei';

const app = Vue.createApp({
    data() {
        return {
            loadingState: {
                isloading: '',
            },
            products: [],
            product: {},
            cart: {},
            qty: 1,
            userPtModal: null,
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        }
    },
    methods: {
        getDatas() {
            axios.get(`${url}/api/${path}/products`)
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((error) => {
                    alert(error.response.data.message);
                })
        },
        getData(id) {
            this.loadingState.isloading = id;
            axios.get(`${url}/api/${path}/product/${id}`)
                .then((response) => {
                    this.loadingState.isloading = '';
                    this.product = response.data.product;
                    this.$refs.modal.openModal();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                })
        },
        getCart() {
            axios.get(`${url}/api/${path}/cart`)
                .then((res) => {
                    this.cart = res.data.data;
                })
                .catch((error) => {
                    alert(error.response.data.message);
                })
        },
        addProduct(id, qty = 1) {
            this.loadingState.isloading = id;
            const cart = {
                product_id: id,
                qty
            };

            axios.post(`${url}/api/${path}/cart`, { data: cart })
                .then((res) => {
                    alert(res.data.message);
                    this.loadingState.isloading = '';
                    this.$refs.modal.closeModal();
                    this.getCart();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                })
        },
        delCart(id) {
            this.loadingState.isloading = id;
            axios.delete(`${url}/api/${path}/cart/${id}`)
                .then((res) => {
                    this.loadingState.isloading = '';
                    alert(res.data.message);
                    this.getCart();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                })
        },
        delItems() {
            axios.delete(`${url}/api/${path}/carts`)
                .then((res) => {
                    alert(res.data.message);
                    this.getCart();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                })
        },
        updateStatus(carts) {
            this.loadingState.isloading = carts.id;
            const cart = {
                product_id: carts.product_id,
                qty: carts.qty,
            }
            axios.put(`${url}/api/${path}/cart/${carts.id}`, { data: cart })
                .then((res) => {
                    this.loadingState.isloading = '';
                    this.getCart();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                })
        },
        addOrder() {
            const order = this.form;
            axios.post(`${url}/api/${path}/order`, { data: order })
                .then((res) => {
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.loadingState.isloading = '';
                    this.getCart();
                })
                .catch((error) => {
                    alert(error.response.data.message);
                })
        },
    },
    mounted() {
        this.getDatas();
        this.getCart();
    },
    components: {
        userProductModal,
    }
});


app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.use(VueLoading.LoadingPlugin);
app.mount('#app');

