import { readFile, writeFile } from "fs/promises";
import bcrypt from "bcrypt";

interface User { id: number; nome: string; email: string; senha: string; }
const ARQUIVO = "dados/usuarios.json";
const SALT_ROUNDS = 10;

export class UserModel {
    salvar(users: User[]): Promise<void> {
        return writeFile(ARQUIVO, JSON.stringify(users, null, 2));
    }
    carregar(): Promise<User[]> {
        return readFile(ARQUIVO, "utf-8")
            .then((data) => JSON.parse(data) as User[])
            .catch(() => []);
        }
    buscarPorEmail(email: string): Promise<User | undefined> {
        return this.carregar().then((users: any[]) => users.find((u: { email: any; }) => u.email === email));
    }
    buscarPorId(id: number): Promise<User | undefined> {
        return this.carregar().then((users: any[]) => users.find((u: { id: number; }) => u.id === id));
    }
    registrar(nome: string, email: string, senhaTexto: string): Promise<User> {
        return this.buscarPorEmail(email).then((existingUser) => {
            if (existingUser) {
                throw new Error("Email já registrado");
            }
            return bcrypt.hash(senhaTexto, SALT_ROUNDS).then((hash) => {
                const newUser: User = { id: Date.now(), nome, email, senha: hash };
                return this.carregar().then((users) => {
                    users.push(newUser);
                    return this.salvar(users).then(() => newUser);
                });
            });
        });
    }
    login(email: string, senhaTexto: string): Promise<User | null> {
        return this.buscarPorEmail(email).then((user) => {
            if (!user) {
                return null;
            }
            return bcrypt.compare(senhaTexto, user.senha).then((isMatch) => (isMatch ? user : null));
        });
    }    
}
        /*
   salvar(users: User[]): Promise<void>
   buscarPorEmail(email: string): Promise<User | undefined>
   buscarPorId(id: number): Promise<User | undefined>
   registrar(nome, email, senhaTexto): Promise<User>
      verificar email duplicado
      bcrypt.hash(senhaTexto, SALT_ROUNDS)
      salvar com hash
   login(email, senhaTexto): Promise<User | null>
      buscar por email
      bcrypt.compare(senhaTexto, user.senha)
      retornar user se correto, null se errado
*/
