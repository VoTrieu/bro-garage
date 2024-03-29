import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { loginRequest } from "../../store/auth-actions";
import classes from "./LoginPage.module.scss";
import { Card } from "primereact/card";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errorMessage, loginSuccess, isTokenValid } = useSelector(
    (state) => state.auth
  );
  const isShowSpinner = useSelector((state) => state.ui.isShowSpinner);

  const defaultValues = {
    UserName: "",
    Password: "",
  };

  //check if is new token
  useEffect(() => {
    if (isTokenValid && loginSuccess) {
      navigate("/app/home");
    }
  }, [loginSuccess, isTokenValid, navigate]);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const onSubmitLogin = (formValue, e) => {
    e.nativeEvent.preventDefault();
    dispatch(loginRequest(formValue));
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const header = (
    <div className={classNames("text-center", classes.logo_container)}>
      <img
        className="w-8 m-auto h-6rem"
        alt="Card"
        src='/images/logo.png'
      />
    </div>
  );

  return (
    <Fragment>
      <div className="flex w-screen h-screen relative">
        <Card
          header={header}
          className={classNames("m-auto", classes.login_container)}
        >
          {!loginSuccess && (
            <Message
              className="mb-3 justify-content-start"
              severity="error"
              sticky={true}
              closable={true}
              text={errorMessage}
            />
          )}
          <form
            onSubmit={handleSubmit(onSubmitLogin)}
            className="formgrid grid"
          >
            <div className="field col-12 p-fluid">
              <label htmlFor="UserName">Tên người dùng</label>
              <Controller
                name="UserName"
                control={control}
                rules={{ required: "Tên người dùng không được để trống!" }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    autoFocus
                    className={classNames("block w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("UserName")}
            </div>

            <div className="field col-12 p-fluid">
              <label htmlFor="Password">Mật khẩu</label>
              <Controller
                name="Password"
                control={control}
                rules={{ required: "Mật khẩu không được để trống!" }}
                render={({ field, fieldState }) => (
                  <Password
                    id={field.name}
                    {...field}
                    toggleMask
                    className={classNames("block w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    feedback={false}
                  />
                )}
              />
              {getFormErrorMessage("Password")}
            </div>
            <div className="flex w-full justify-content-end mr-2">
              <Button
                disabled={isShowSpinner}
                label="Đăng nhập"
                icon="pi pi-check"
                className="p-button-success"
              />
            </div>
          </form>
        </Card>
        <ProgressSpinner
          style={{ width: "40px", height: "40px" }}
          strokeWidth="4"
          fill="var(--surface-ground)"
          animationDuration=".5s"
          className={[
            classes.login_spinner,
            classNames("absolute", {
              hidden: !isShowSpinner,
            }),
          ]}
        />
      </div>
    </Fragment>
  );
};

export default LoginPage;
