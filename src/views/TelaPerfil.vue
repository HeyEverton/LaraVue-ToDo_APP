<template>
    <div class="container d-flex justify-content-center mt-10">
        <NavBar />

        <ValidationObserver tag="form" ref="profileForm" @submit.stop.prevent="updateUser">
            <form>
                <div class="mb-3 mt-4">
                    <h1 class="mb-4">Meu perfil</h1>

                    <div :class="`alert alert-${response.color}`" v-if="response.message">
                        <h6>{{response.message}}</h6>
                    </div>

                    <ValidationProvider v-slot="{errors}" rules="required" name="Primeiro nome">
                        <label for="email" class="form-label fs-5">Primeiro nome</label>
                        <input v-model="firstName" type="text" class="form-control" id="firstName"
                            placeholder="Insira seu nome">
                        <div class="text-danger fs-6" v-if="!!errors[0]">
                            {{errors[0]}}
                        </div>
                    </ValidationProvider>
                </div>

                <div class="mb-3 mt-4">
                    <label for="email" class="form-label fs-5">Sobrenome</label>
                    <input v-model="lastName" type="text" class="form-control" id="lastName"
                        placeholder="Insira seu sobrenome">
                </div>

                <div class="mb-3 mt-4">
                    <ValidationProvider rules="required|email" name="E-mail" v-slot="{ errors }">
                        <label for="email" class="form-label fs-5">E-mail</label>
                        <input v-model="email" type="email" class="form-control" id="email"
                            placeholder="Insira seu e-mail">
                        <div class="text-danger fs-6" v-if="!!errors[0]">
                            {{errors[0]}}
                        </div>
                    </ValidationProvider>
                </div>

                <div class="mb-3">
                    <ValidationProvider rules="regex:(^[a-zA-Z0-9 _-]+[a-zA-Z0-9-14\-[a-zA-Z0-9-.]+$)" name="Senha" v-slot="{ errors }">
                        <label for="password" class="form-label fs-5">Senha</label>
                        <input v-model="password" type="password" class="form-control" id="password"
                            placeholder="Insira sua senha">

                        <div class="text-danger fs-6" v-if="!!errors[0]">
                            {{errors[0]}}
                        </div>
                    </ValidationProvider>

                    <div class="mt-2">
                        <router-link class="link-primary d-inline-block" to="/esqueci-senha">Esqueci minha senha
                        </router-link>
                    </div>
                </div>

                <div class="d-flex justify-content-center flex-wrap ">

                    <button :disabled="spinner.profile" @click="updateUser" type="submit"
                        class="btn btn-primary fs-2 d-flex align-items-center justify-content-center">
                        <img v-if="spinner.profile" src="@/assets/img/spinner.svg" class="thumbnail mr-2" alt="">
                        Salvar
                    </button>
                </div>
            </form>
        </ValidationObserver>
    </div>
</template>
<script>
import NavBar from '@/components/Partials/TheHeader'
import { mapState, mapMutations } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import message from '@/utils/messages'

export default {
    name: 'TelaPerfil',
    components: {
        NavBar,
        ValidationObserver,
        ValidationProvider
    },

    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            response: {
                message: '',
                color: '',
            },
            spinner: {
                profile: false
            },
        }
    },

    methods: {
        ...mapMutations('user', ['STORE_USER']),
        async updateUser() {
            const validator = await this.$refs.profileForm.validate()
            if (!validator) { return }

            const payload = {
                first_name: this.firstName,
                last_name: this.lastName,
                email: this.email,

            }

            if (this.password) {
                payload.password = this.password
            }

            this.spinner.profile = true;

            this.$http
                .put('v1/me', payload)
                .then((response) => {
                    this.response.color = 'success'
                    this.response.message = 'Seu perfil foi atualizado com sucesso!'

                    this.STORE_USER(response.data.data)
                })
                .catch((e) => {
                    const errorCode = e?.response?.data?.error || 'ServerError'
                    this.response.color = 'danger';
                    this.response.message = message[errorCode]
                })
                .finally(() => {
                    this.spinner.profile = false;
                });
        }
    },

    created() {
        this.firstName = this.user.first_name
        this.lastName = this.user.last_name
        this.email = this.user.email
    },

    computed: {
        ...mapState({
            user: state => state.user.user
        }),
    },
}
</script>
