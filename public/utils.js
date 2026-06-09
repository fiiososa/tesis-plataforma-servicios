function mostrarToast(mensaje, tipo = "success") {

    const toast = document.createElement("div");

    toast.classList.add("toast");

    if (tipo === "success") {

        toast.classList.add("toast-success");

        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${mensaje}</span>
        `;

    }

    if (tipo === "error") {

        toast.classList.add("toast-error");

        toast.innerHTML = `
            <i class="fas fa-times-circle"></i>
            <span>${mensaje}</span>
        `;

    }

    if (tipo === "warning") {

        toast.classList.add("toast-warning");

        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${mensaje}</span>
        `;

    }

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.style.animation = "slideOut 0.4s ease";

        setTimeout(() => {

            toast.remove();

        }, 400);

    }, 3000);

}