<template>
  <img class="PayPayLogo" alt="PayPay Logo" src="/logo_paypay.svg" />
</template>

<style>
  .PayPayLogo {
    height: 180px;
    width: 180px;
    transform: rotateX(360deg);
    animation: turn 1.5s ease-out forwards 1s;
  }

  @keyframes turn {
    100% {
      transform: rotateX(0deg);
    }
  }
</style>
