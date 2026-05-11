import bcrypt from 'bcryptjs';

async function provera() {
    console.log("Krećem sa testiranjem (ESM verzija)...");
    const lozinka = "andjela123";
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(lozinka, salt);
        console.log("1. Heš uspešno kreiran:", hash);

        const match = await bcrypt.compare(lozinka, hash);
        console.log("2. Da li se poklapaju?:", match);
        
        if(match) console.log("SVE RADI SAVRŠENO!");
    } catch (e) {
        console.log("GREŠKA:", e.message);
    }
}

provera();