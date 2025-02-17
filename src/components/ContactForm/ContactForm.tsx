import styles from "./ContactForm.module.css";
import Swal from "sweetalert2";
import { FormEvent, useRef } from "react";
import { useState } from "react";
import { Button } from "../Button/Button.tsx";

export function ContactForm() {
  const { fieldMessage, field, formSection, form, error } = styles;

  const regEx = /^\S+@\S+\.\S+$/;
  const [emailError, setEmailError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null!);
  const emailRef = useRef<HTMLInputElement>(null!);
  const messageRef = useRef<HTMLTextAreaElement>(null!);
  const isFormInvalid = !!emailError.length;

  function emailValidation() {
    const emailValue = emailRef.current.value;
    const isEmailValid = regEx.test(emailValue);
    setEmailError(isEmailValid ? "" : "Email is not valid");
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append("access_key", "d20c2e5d-55b1-4797-bf63-4587401626ef");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      await Swal.fire({
        title: "Thank you for your submit",
        text: "We will reply to your email as soon as possible.",
        icon: "success",
      });
      nameRef.current.value = "";
      emailRef.current.value = "";
      messageRef.current.value = "";
    }
  };

  return (
    <>
      <section className={formSection}>
        <form className={form} onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              className={field}
              placeholder="Your Name"
              name="name"
              ref={nameRef}
              required
            />
          </div>
          <div>
            <input
              type="text"
              className={field}
              placeholder="Your Email"
              name="email"
              ref={emailRef}
              required
              onChange={emailValidation}
            />
            {emailError.length ? (
              <div className={error}>Email is not valid</div>
            ) : null}
          </div>
          <div>
            <textarea
              className={fieldMessage}
              placeholder="Your Message"
              name="message"
              ref={messageRef}
              required
            ></textarea>
          </div>
          <Button
            label={"Submit"}
            size={"regular"}
            variant={"secondary"}
            onClick={emailValidation}
            disabled={isFormInvalid}
            type="submit"
          />
        </form>
      </section>
    </>
  );
}
