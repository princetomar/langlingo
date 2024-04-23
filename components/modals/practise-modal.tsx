"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { usePractiseModal } from "@/store/use-practise-modal";
import Image from "next/image";
import { useEffect, useState } from "react";

const PractiseModal = () => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = usePractiseModal();

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className=" flex items-center w-full justify-center mb-5">
            <Image src="/heart.svg" alt="Heart" height={100} width={100} />
          </div>
          <DialogTitle className=" text-center font-bold text-2xl">
            Practise lesson
          </DialogTitle>
          <DialogDescription className=" text-center text-base">
            Use practise lessons to regain hearts and points. You cannot loose
            hearts or points in practise lessons.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4 ">
          <div className=" flex flex-col gap-y-4 w-full">
            <Button
              variant="primary"
              className="w-full "
              size="lg"
              onClick={close}
            >
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PractiseModal;
