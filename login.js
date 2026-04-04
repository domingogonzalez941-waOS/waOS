const loginModalHTML = `
    <div id="login-modal" class="fixed inset-0 z-[100] flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
        <!-- Backdrop Blur extremo (Efecto aislamiento) -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-xl" onclick="toggleLoginModal()"></div>
        
        <!-- Caja Principal -->
        <div class="relative w-full max-w-sm mx-6 bg-[#050505]/95 border border-white/10 rounded-[2rem] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.9)] transform scale-95 transition-transform duration-300" id="login-box">
            <!-- Icono Cerrar -->
            <button onclick="toggleLoginModal()" class="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>

            <!-- Cabecera -->
            <div class="flex flex-col items-center mb-8 pt-2">
                <div class="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(196,255,0,0.15)] mb-4">
                    <span class="text-acurast font-bold font-mono text-xl">w</span>
                </div>
                <h2 class="text-2xl font-display font-bold text-white">Acceso a la Plataforma</h2>
                <p class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-acurast animate-pulse"></span>Ingresa a tu cuenta
                </p>
            </div>

            <!-- Form -->
            <form onsubmit="event.preventDefault(); toggleLoginModal();" class="space-y-5">
                <div class="space-y-1.5">
                    <label class="text-xs text-gray-300 font-medium">Correo Electrónico</label>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-acurast">
                            <i data-lucide="mail" class="w-4 h-4 text-gray-500 group-focus-within:text-acurast"></i>
                        </div>
                        <input type="email" required placeholder="ejemplo@correo.com" data-original-placeholder="ejemplo@correo.com"
                            class="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-acurast focus:ring-1 focus:ring-acurast transition-all font-sans text-sm shadow-inner shadow-black">
                    </div>
                </div>

                <div class="space-y-1.5">
                    <div class="flex justify-between items-end mb-1">
                        <label class="text-xs text-gray-300 font-medium">Contraseña</label>
                        <a href="#" class="text-xs text-gray-500 hover:text-acurast transition-colors">¿Olvidaste tu contraseña?</a>
                    </div>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-acurast">
                            <i data-lucide="lock" class="w-4 h-4 text-gray-500 group-focus-within:text-acurast"></i>
                        </div>
                        <input type="password" required placeholder="••••••••" data-original-placeholder="••••••••"
                            class="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-acurast focus:ring-1 focus:ring-acurast transition-all font-sans tracking-[0.2em] text-sm shadow-inner shadow-black">
                    </div>
                </div>

                <div class="flex items-center pt-1">
                    <div class="relative flex items-center">
                        <input id="remember" type="checkbox" class="peer appearance-none w-4 h-4 bg-black/40 border border-white/20 rounded checked:bg-acurast checked:border-acurast focus:outline-none cursor-pointer transition-all">
                        <i data-lucide="check" class="absolute w-3 h-3 text-black left-0.5 top-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                    </div>
                    <label for="remember" class="ml-2 block text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                        Mantener mi sesión iniciada
                    </label>
                </div>

                <button type="submit"
                    class="w-full py-3.5 mt-2 bg-acurast text-black font-bold rounded-xl hover:shadow-[0_0_25px_rgba(196,255,0,0.3)] hover:bg-white transition-all flex items-center justify-center gap-2 text-sm font-bold transition-all group">
                    Iniciar Sesión <i data-lucide="log-in" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                </button>
            </form>

            <div class="mt-6 border-t border-white/10 pt-4 text-center">
                <p class="text-xs text-gray-500 leading-relaxed">
                    Las inscripciones están cerradas. <br>La creación de cuentas es procesada manualmente por el administrador.
                </p>
            </div>
        </div>
    </div>
`;

// Insert the HTML directly into the body
const container = document.createElement('div');
container.innerHTML = loginModalHTML;
document.body.appendChild(container.firstElementChild);

// Global Toggle Function
window.toggleLoginModal = function () {
    const modal = document.getElementById('login-modal');
    const box = document.getElementById('login-box');
    if (modal.classList.contains('opacity-0')) {
        // Abrir
        modal.classList.remove('opacity-0', 'pointer-events-none');
        box.classList.remove('scale-95');
        box.classList.add('scale-100');
    } else {
        // Cerrar
        modal.classList.add('opacity-0', 'pointer-events-none');
        box.classList.remove('scale-100');
        box.classList.add('scale-95');
    }
}
