# Penjelasan Source Code Tugas 9

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




# Penjelasan Source Code CRUD Tugas 10
## Tampilan Awal Home

![image](https://github.com/user-attachments/assets/9c7fe139-e1e4-4dc1-a419-59c1e9dfb510)

Tampilan home berisi tentang daftar aktivitas yang akan kita lakukan. Kita bisa menambahkan aktivitas dengan cara menekan tombol + di kanan bawah.

Kode tampilan ini berasal dari 
```
<ion-content :fullscreen="true">
  <!-- Refresh Data -->
  <ion-refresher @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <!-- Daftar Active Todos -->
  <ion-list>
    <ion-item-sliding
      v-for="todo in activeTodos"
      :key="todo.id"
    >
      <ion-item>
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ todo.title }}</ion-card-title>
            <ion-card-subtitle>{{ todo.description }}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>
      </ion-item>
      <ion-item-options>
        <ion-item-option @click="handleDelete(todo)">
          <ion-icon :icon="trash"></ion-icon>
        </ion-item-option>
        <ion-item-option @click="handleStatus(todo)">
          <ion-icon :icon="checkmarkCircle"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</ion-content>
```

## Tampilan Form Tambah Aktivitas

![image](https://github.com/user-attachments/assets/026b0b32-4ea9-4574-9fcd-aa5871cdc0da)

Tampilan ini didapatkan ketika anda menekan tombol + di kanan bawah. Ini berisikan judul dan deskripsi dari aktivitas yang akan kita lakukan.

Button add todo akan meneruskan data yang diinputkan pengguna dalam modal ke fungsi handleSubmit 
```
<InputModal
  v-model:isOpen="isOpen"
  @submit="handleSubmit"
/>
```
Tampilan form add to do didapat dari kode berikut:
```
<template>
    <ion-modal :is-open="isOpen" @did-dismiss="cancel">
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ editingId ? '' : 'Add' }} Todo</ion-title>
                <ion-buttons slot="start">
                    <ion-button @click="cancel"><ion-icon :icon="close"></ion-icon></ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-input v-model="localTodo.title" label="Title" label-placement="floating"
                    placeholder="Enter Title"></ion-input>
            </ion-item>
            <ion-item>
                <ion-textarea v-model="localTodo.description" label="Description" label-placement="floating"
                    placeholder="Enter Description" :autogrow="true" :rows="3"></ion-textarea>
            </ion-item>
            <ion-row>
                <ion-col>
                    <ion-button type="button" @click="input" shape="round" color="primary" expand="block">
                        {{ editingId ? '' : 'Add' }} Todo
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-modal>
</template>
```
## Tampilan Home Ketika Berhasil Menambahkan Aktivitas

![image](https://github.com/user-attachments/assets/2738fbff-4e7c-4498-ba86-f2aad60c5b99)
![image](https://github.com/user-attachments/assets/1761d3ab-b809-438f-a6c4-3c4cc4ddb19b)

Data yang ditampilkan berasal dari kode 
```
const activeTodos = computed(() => todos.value.filter(todo => !todo.status));
```

Ketika kita menggeser ke kiri ada 2 opsi yang bisa kita lakukan.

Membuat aktivitas tersebut menjadi completed atau mengedit aktivitas tersebut

![image](https://github.com/user-attachments/assets/ecd9e439-9936-43fe-b0d5-b156958dc1da)

Jika kita memilih untuk edit maka akan muncul 
## Tampilan Edit Aktivitas
Kalian bisa mengubah judul atau deskripsi lalu klik tombol Edit TODO untuk menyimpan data yang telah diubah
![image](https://github.com/user-attachments/assets/ce2cb8d8-08f7-4ef0-ae0c-1d5b90795f33)

Akses ini berasal dari kode
```
const handleEdit = async (editTodo: Todo) => {
  const slidingItem = itemRefs.value.get(editTodo.id!);
  await slidingItem?.close(); // Menutup sliding menu setelah klik edit

  editingId.value = editTodo.id!; // Menyimpan ID todo yang sedang diedit
  todo.value = { // Mengisi form modal dengan data todo
    title: editTodo.title,
    description: editTodo.description,
  };
  isOpen.value = true; // Membuka modal edit
};
```
Kode Tampilan
```
<ion-modal :is-open="isOpen" @did-dismiss="cancel">
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ editingId ? "Edit" : "" }} Todo</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item>
      <ion-input
        v-model="todo.title"
        label="Title"
        label-placement="floating"
        placeholder="Enter Title"
      ></ion-input>
    </ion-item>
    <ion-item>
      <ion-textarea
        v-model="todo.description"
        label="Description"
        label-placement="floating"
        placeholder="Enter Description"
      ></ion-textarea>
    </ion-item>
    <ion-button @click="input">{{ editingId ? "Edit" : "" }} Todo</ion-button>
  </ion-content>
</ion-modal>
```
![image](https://github.com/user-attachments/assets/3b78d886-149c-41d1-80c1-f84f27623dee)

ini adalah tampilan home ketika data tersebut sudah diubah 

Tetapi jika kita memilih untuk completed maka akan muncul 
## Tampilan Home Completed 

![image](https://github.com/user-attachments/assets/3cc42a06-c7d1-42ff-9ae2-4ec8e3c3696d)

Proses ini berasal dari koode 
```
  const slidingItem = itemRefs.value.get(statusTodo.id!);
  await slidingItem?.close();
  try {
    await firestoreService.updateStatus(statusTodo.id!, !statusTodo.status);
    await showToast(
      `Todo marked as ${!statusTodo.status ? "completed" : "active"}`,
      "success",
      checkmarkCircle
    );
    loadTodos();
  } catch (error) {
    await showToast("Failed to update status", "danger", closeCircle);
    console.error(error);
  }
};
```

## Tampilan Hapus Aktivitas

![image](https://github.com/user-attachments/assets/4e68e325-1dd3-4e1d-943a-d3e8adb02f6f)

Fitur ini didapatkan ketika Anda menggeser aktivitas ke kanan. Fitur tersebut berasal dari kode
```
<ion-item-options side="start" @ionSwipe="handleDelete(todo)">
  <ion-item-option
    color="danger"
    expandable
    @click="handleDelete(todo)"
  >
    <ion-icon
      slot="icon-only"
      :icon="trash"
      size="large"
    ></ion-icon>
  </ion-item-option>
</ion-item-options>
```

## Tampilan Berhasil Hapus Aktivitas

![image](https://github.com/user-attachments/assets/d62099ec-5772-4744-bed9-b726e1d29cc8)

Aktivitas yang telah berhasil di hapus akan hilang dari halaman home

## Marked as Active

![image](https://github.com/user-attachments/assets/d5383529-6e7f-4c17-8c2e-26198ddd76eb)

Kita juga bisa membuat aktivitas yang sudah completed menjadi aktif(uncomplete) lagi dengan cara menggeser ke kiri pada aktivitas yang dimau.

Proses ini didapatkan dari kode 
```
const handleStatus = async (statusTodo: Todo) => {
  const slidingItem = itemRefs.value.get(statusTodo.id!); // Mendapatkan elemen terkait
  await slidingItem?.close(); // Menutup elemen sliding

  try {
    // Mengubah status todo (completed <-> active)
    await firestoreService.updateStatus(statusTodo.id!, !statusTodo.status);
    await showToast(
      `Todo marked as ${!statusTodo.status ? "completed" : "active"}`, // Menampilkan notifikasi
      "success",
      checkmarkCircle
    );
    loadTodos(); // Memuat ulang data todo
  } catch (error) {
    await showToast("Failed to update status", "danger", closeCircle);
    console.error(error);
  }
};
```

![image](https://github.com/user-attachments/assets/af1e1169-9b74-4119-bb7b-b53b52924492)

ini adalah tampilan ketika anda sudah berhasil membuat aktivitas tersebut menjadi aktif kembali
