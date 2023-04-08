import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class CustomvalidationService {

    assingValidator(parameters: any, numColumn: string, value: any, validatorText: string) {
        if (validatorText === 'password')
            parameters[numColumn] = [value, [Validators.required, this.patternValidatorPassword()]];
        else if (validatorText === 'nameUser')
            parameters[numColumn] = [value, [Validators.required, this.validateUserName()]];
        else if (validatorText == 'validatePhone')
            parameters[numColumn] = [value, [Validators.required, this.validatePhone()]];
        else if (validatorText == 'validateDNI')
            parameters[numColumn] = [value, [Validators.required, this.validateDNI()]];
        else if (validatorText == 'validateDirecction')
            parameters[numColumn] = [value, [Validators.required, this.validateDirecction()]];
        else if (validatorText == 'validateLatitude')
            parameters[numColumn] = [value, [Validators.required, this.latitudeValidator()]];
        else if (validatorText == 'validateLongitude')
            parameters[numColumn] = [value, [Validators.required, this.longitudeValidator()]];
    }

    // validators of the form:

    latitudeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            let n = Number(control.value);
            let valid = false;
            if (n >= -90 && n <= 90)
                valid = true;
            return valid ? null : { forbiddenName: { value: control.value } };
        };
    }

    longitudeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            let n = Number(control.value);
            let valid = false;
            if (n >= -180 && n <= 180)
                valid = true;
            return valid ? null : { forbiddenName: { value: control.value } };
        };
    }


    patternValidatorPassword(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            if (control.value.length > 16)
                return { value: 'Demasiadas letras' };
            //const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
            // minuscula, mayuscula, numero, carazter especial y entre 8-16 letras
            const regex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}');
            const valid = regex.test(control.value);
            return !valid ? { forbiddenName: { value: control.value } } : null;
        };
    }

    MatchPassword(password: string, confirmPassword: string) {
        return (formGroup: FormGroup) => {
            const passwordControl = formGroup.controls[password];
            const confirmPasswordControl = formGroup.controls[confirmPassword];

            if (!passwordControl || !confirmPasswordControl) {
                return null;
            }

            if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
                return null;
            }

            if (passwordControl.value !== confirmPasswordControl.value) {
                confirmPasswordControl.setErrors({ passwordMismatch: true });
            } else {
                confirmPasswordControl.setErrors(null);
            }
            return null;
        }
    }

    //userNameValidator(userControl: AbstractControl) {
    //    return new Promise(resolve => {
    //        setTimeout(() => {
    //            if (this.validateUserName(userControl.value)) {
    //                resolve({ userNameNotAvailable: true });
    //            } else {
    //                resolve(null);
    //            }
    //        }, 1000);
    //    });
    // }


    validateUserName(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            if (control.value.length > 20)
                return { value: 'Demasiadas letras' };
            if (control.value.length < 3)
                return { value: 'Demasiadas pocas letras' };
            const regex = new RegExp('(?=.*[a-z])(?=.*[A-Z]).{3,}$');
            let valid = regex.test(control.value.replace(/\s/g, ''));
            if (valid) {
                for (let c of control.value)
                    if (c == '0' || c == '9' || (c > '0' && c < '9'))
                        valid = false;
            }
            return valid ? null : { forbiddenName: { value: control.value } };
        };
    }

    validateDirecction(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            if (control.value.length > 160)
                return { value: 'Demasiadas letras' };
            if (control.value.length < 3)
                return { value: 'Demasiadas pocas letras' };
            const regex = new RegExp('(?=.*[a-z])(?=.*[A-Z]).{3,}$');
            let valid = regex.test(control.value.replace(/\s/g, ''));
            return valid ? null : { forbiddenName: { value: control.value } };
        };
    }


    validatePhone(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            let valid = (control.value.length < 11 && control.value.length > 8);
            for (let i = 0; i < control.value.length && valid; i++) {
                if (control.value[i] < '0' || control.value[i] > '9')
                    valid = false;
            }
            return valid ? null : { value: control.value };
        };
    }

    // validate dni
    validateDNI(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let dni = control.value;
            let numero, letr, letra;
            let expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

            dni = dni.toUpperCase();

            if (expresion_regular_dni.test(dni) === true) {
                numero = dni.substr(0, dni.length - 1);
                numero = numero.replace('X', 0);
                numero = numero.replace('Y', 1);
                numero = numero.replace('Z', 2);
                letr = dni.substr(dni.length - 1, 1);
                numero = numero % 23;
                letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
                letra = letra.substring(numero, numero + 1);
                if (letra != letr) {
                    //alert('Dni erroneo, la letra del NIF no se corresponde');
                    return { value: control.value };
                } else {
                    //alert('Dni correcto');
                    return null;
                }
            } else {
                //alert('Dni erroneo, formato no válido');
                return { value: control.value };
            }
        }
    }



}