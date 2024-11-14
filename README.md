# Penjelasan Source Code

## Login Page

![image](https://github.com/user-attachments/assets/e09134de-ed43-4272-93b7-e599a5bd0e53)

Ketika kita mengakses aplikasi ini, kita akan berjumpa dengan halaman ini untuk pertama kalinya.
Klik "SIGN IN WITH GOOGLE" untuk lanjut ke halaman berikutnya.
```template
<!-- Button Sign In -->
                <ion-button @click="login" color="light">
                    <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
                    <ion-label>Sign In with Google</ion-label>
                </ion-button>
```
```script
const login = async () => {
    await authStore.loginWithGoogle();
};
```

![image](https://github.com/user-attachments/assets/3cd4d318-8f11-4694-9335-2d09570b1497)

Pilih akun yang ingin anda gunakan untuk Login kemudian Klik "OK"

Ini adalah Router ketika kita berhasil melakukan Login kita langsung menuju Home Page, tetapi ketika gagal kembali ke Login Page
```router/index.ts
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.path === '/login' && authStore.isAuth) {
    next('/home');
  } else if (to.meta.isAuth && !authStore.isAuth) {
    next('/login');
  } else {
    next();
  }
});
```

## Home Page

![image](https://github.com/user-attachments/assets/06d1f412-ca7f-42f4-949b-29dba323bd39)

Setelah berhasil login kita langsung diarahkan ke halaman Home Page. Tidak ada apapun di halaman ini.

Ini adalah kode dari tampilan Home Page
```template
<ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div>
      </div>
      <TabsMenu />
    </ion-content>

  </ion-page>
```
Untuk dapat mengakses Profile Page, klik Profile di bagian bawah kanan

## Profile Page

![WhatsApp Image 2024-11-13 at 22 57 27_aed113d5](https://github.com/user-attachments/assets/cca008b3-72c0-4f44-bd70-729cdb305afa)

Di halaman profile page kita dapat melihat foto pofile, nama, dan akun yang digunakan pada saat login di awal tadi.
```template
<!-- Avatar -->
            <div id="avatar-container">
                <ion-avatar>
                    <img alt="Avatar" :src="userPhoto" @error="handleImageError" />
                </ion-avatar>
            </div>

            <!-- Data Profile -->
            <ion-list>
                <ion-item>
                    <ion-input label="Nama" :value="user?.displayName" :readonly="true"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-input label="Email" :value="user?.email" :readonly="true"></ion-input>
                </ion-item>
            </ion-list>
```

Ini adalah script untuk menampilkan data akun
```script
const userPhoto = ref(user.value?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg');

function handleImageError() {
    userPhoto.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
}
```

Ketika kita menekan tombol Log Out di pojok kanan atas maka akan kembali ke halaman login.
```template
                <!-- Logout Button -->
                <ion-button slot="end" fill="clear" @click="logout" style="--color: gray;">
                    <ion-icon slot="end" :icon="exit"></ion-icon>
                    <ion-label>Logout</ion-label>
                </ion-button>
```
```script
const logout = () => {
    authStore.logout();
};
```
