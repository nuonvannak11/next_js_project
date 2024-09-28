"use client";

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { UpdateUserSubmitter } from "../../utils/hooks/api";
import {
  encrypt_many_data,
  link_img,
  data_emty,
} from "../../utils/glable_function";
import { postSession } from "../../utils/glable_function";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { useSessionData } from "@/utils/helper/use_selector";

const UpdateProfile: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState("/assets/users/user.png");
  const [telegram, setTelegram] = useState("");
  const [bankno, setBankno] = useState("");
  const [bankacc, setBankacc] = useState("");
  const [gender, setGender] = useState("");
  const [salary, setSalary] = useState("");
  const [tel, setTel] = useState("");
  const [contact_us, setContact_us] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const [openiamge, setOpeniamge] = useState(true);
  const [token, setToken] = useState(Cookies.get("token"));
  const [user_data, setUserData] = useState<any>([]);
  const { isLoggedIn, user } = useSessionData();
  const { t } = useTranslation();
  const imageInput = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const data_token = Cookies.get("token");

  useEffect(() => {
    if (data_token) {
      setToken(data_token);
    }
    if (isLoggedIn && user) {
      setUserData(user);
    }
  }, [isLoggedIn, user]);

  const handleChange = (setter: any) => (event: any) => {
    setter(event.target.value);
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setOpeniamge(false);
      setImage(file.name);
    }
  };

  const handleClick = () => {
    if (imageInput.current) {
      imageInput.current.click();
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
    }, 300);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      telegram,
      bankacc,
      bankno,
      gender,
      salary,
      tel,
      contact_us,
      address,
      age,
      image,
    };

    let timerInterval: any;
    let swalTimer: any;
    let apiData: any;
    try {
      await Swal.fire({
        title: t("Please Wait"),
        html: t("Please wait a moment"),
        timerProgressBar: true,
        didOpen: async () => {
          Swal.showLoading();
          apiData = await UpdateUserSubmitter(
            encrypt_many_data(formData),
            token
          );
          const popup = Swal.getPopup();
          if (popup) {
            const timer = popup.querySelector("b");
            if (timer) {
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            }
          }
          Swal.close();
        },
        willClose: () => {
          clearInterval(timerInterval);
          clearTimeout(swalTimer);
        },
      });

      let code_msg = Number(apiData.code);
      let message = apiData.message;

      if (code_msg === 1) {
        postSession(dispatch, apiData);
        Swal.fire({
          icon: "success",
          title: t("Update Successful"),
          text: t(message),
          timer: 2000,
          timerProgressBar: true,
          footer: t("Welcome Back!"),
        }).then((result) => {
          if (
            result.dismiss === Swal.DismissReason.timer ||
            result.isConfirmed
          ) {
            setClosing(true);
            setTimeout(() => {
              setShowModal(false);
              setClosing(false);
            }, 300);
          }
        });
      } else if (code_msg === -1) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: t(message),
          footer: t("Please Try Again!"),
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.close();
    }
  };

  return (
    <div className="update-users-default">
      <button className="mainbutton" onClick={openModal}>
        {t("Update Profile")}
      </button>
      {showModal && (
        <div className={`overlay ${closing ? "fadeOut" : "fadeIn"}`}>
          <div className={`popup ${closing ? "slideOut" : "slideIn"}`}>
            <h1>{t("Update Users Profile")}</h1>
            <button className="close-button" onClick={closeModal}>
              <Image
                src="/assets/icon/close.png"
                alt="close"
                width={50}
                height={50}
                priority
              />
            </button>
            <div className="cover-logo">
              <div className="cover-main-log">
                <Image
                  src={
                    openiamge
                      ? user_data.image
                        ? `/assets/users/${link_img(user_data.image)}`
                        : selectedImage
                      : selectedImage
                  }
                  alt="user"
                  width={100}
                  height={100}
                  priority
                />
              </div>
              <div className="cover-change-logo" onClick={handleClick}>
                <Image
                  src="/assets/icon/change.png"
                  alt="Not found"
                  width={50}
                  height={50}
                  priority
                />
                <input
                  type="file"
                  ref={imageInput}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="cover-update-users">
                <div className="form-group">
                  <label>{t("Telegram")}:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={data_emty(user_data.telegram)}
                    id="telegram"
                    name="telegram"
                    value={telegram}
                    onChange={handleChange(setTelegram)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bankacc">{t("Bank Name")}:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="bankacc"
                    placeholder={data_emty(user_data.bankacc)}
                    name="bankacc"
                    value={bankacc}
                    onChange={handleChange(setBankacc)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bankno">{t("Bank Number")}:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={data_emty(user_data.bankno)}
                    id="bankno"
                    name="bankno"
                    value={bankno}
                    onChange={handleChange(setBankno)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">{t("Gender")}:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="gender"
                    placeholder={data_emty(user_data.gender)}
                    name="gender"
                    value={gender}
                    onChange={handleChange(setGender)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="salary">{t("Salary")}:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="salary"
                    placeholder={data_emty(user_data.salary)}
                    name="salary"
                    value={salary}
                    onChange={handleChange(setSalary)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tel">{t("Mobile Number")}:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tel"
                    placeholder={data_emty(user_data.tel)}
                    name="tel"
                    value={tel}
                    onChange={handleChange(setTel)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact_us">{t("Contact Us")}:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={data_emty(user_data.contact_us)}
                    id="contact_us"
                    name="contact_us"
                    value={contact_us}
                    onChange={handleChange(setContact_us)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">{t("Address")}:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={data_emty(user_data.address)}
                    id="address"
                    name="address"
                    value={address}
                    onChange={handleChange(setAddress)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">{t("Age")}:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={data_emty(user_data.age)}
                    id="age"
                    name="age"
                    value={age}
                    onChange={handleChange(setAge)}
                  />
                </div>
              </div>
              <div className="cover-submit">
                <button type="submit" className="update-button">
                  {t("Update Profile")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
