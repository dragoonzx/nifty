import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import React, { Fragment, useState } from "react";
import Moralis from "moralis";
import { useDropzone } from "react-dropzone";
import { store } from "../../state";
import { Link } from "react-router-dom";
import paint from "../../assets/images/paint.jpeg";
import congrats from "../../assets/images/congrats.png";
import { mintMemory } from "../../utils/mintMemory";
import { toast } from "react-toastify";

const QuickPost = ({ onPostPublish }: { onPostPublish?: () => void }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isMemorized, setIsMemorized] = useState(false);

  const closeModal = () => {
    setTitle("");
    setPublicMemory(true);
    acceptedFiles.splice(0, 1);
    setSignersList("");

    setIsOpen(false);

    setTimeout(() => {
      setIsMemorized(false);
    }, 100);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const [isSaving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [publicMemory, setPublicMemory] = useState(true);

  const [memoryHash, setMemoryHash] = useState("");

  const handlePublicMemoryChange = () => {
    setPublicMemory(!publicMemory);
  };
  const handleTitleChange = (e: React.SyntheticEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setTitle(value);
  };

  const saveAndMintMemory = async () => {
    console.log(acceptedFiles);
    if (!acceptedFiles[0]) {
      return;
    }

    setSaving(true);
    try {
      // Save file input to IPFS
      const data = acceptedFiles[0];
      const file = new Moralis.File(data.name, data);

      await file.saveIPFS();
      // mint
      const x = await mintMemory(signersList);
      console.log(x);
      // @ts-expect-error
      console.log(file.ipfs(), file.hash());
      // Save file reference to Moralis
      const memoryInst = new Moralis.Object("Memories");
      memoryInst.set("creator", store.user?.get("ethAddress"));
      memoryInst.set("title", title);
      memoryInst.set("public", publicMemory);
      memoryInst.set("memory", file);
      // @ts-expect-error
      memoryInst.set("memoryHash", file.hash());
      // @ts-expect-error
      memoryInst.set("memoryIpfs", file.ipfs());
      memoryInst.set("memoryToken", x.events?.Transfer?.returnValues?.tokenId);
      // @ts-expect-error
      setMemoryHash(file.hash());
      await memoryInst.save();

      setIsMemorized(true);
      toast.success("Successfully minted memory");
      onPostPublish && onPostPublish();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const [signersList, setSignersList] = useState("");

  const handleSignersList = (e: React.SyntheticEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setSignersList(value);
  };

  const files = acceptedFiles.map((file: any) => (
    <li key={file.path} className="text-xs">
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {!isMemorized ? (
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create memory
                  </Dialog.Title>
                  <div className="sm:max-w-lg w-full bg-white rounded-xl z-10">
                    <form className="mt-4 space-y-3" action="#" method="POST">
                      <div className="grid grid-cols-1 space-y-2">
                        <label className="text-sm font-bold text-gray-500 tracking-wide">
                          Title
                        </label>
                        <input
                          className="input input-bordered"
                          type=""
                          value={title}
                          onChange={handleTitleChange}
                          placeholder="My pepe cat"
                        />
                      </div>
                      <div className="grid grid-cols-1 space-y-2">
                        <label className="text-sm font-bold text-gray-500 tracking-wide">
                          Attach Document
                        </label>
                        <div className=" flex items-center justify-center w-full">
                          <div
                            {...getRootProps({
                              className:
                                "dropzone flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center",
                            })}
                          >
                            <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-blue-400 group-hover:text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                                <img
                                  className="has-mask h-36 mt-10 object-center"
                                  src={paint}
                                  alt=""
                                />
                              </div>
                              <p className="pointer-none text-gray-500 ">
                                <span className="text-sm">Drag and drop</span>{" "}
                                files here <br /> or{" "}
                                <span className="link link-primary">
                                  select a file
                                </span>{" "}
                                from your computer
                              </p>
                            </div>
                            <input {...getInputProps()} />
                          </div>
                        </div>
                      </div>
                      <ul style={{ maxWidth: "300px", margin: 0 }}>{files}</ul>
                      <p className="text-sm text-gray-300">
                        <span>File type: any type you imagine</span>
                      </p>
                      <label className="flex text-sm items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={publicMemory}
                          onChange={handlePublicMemoryChange}
                          className="checkbox checkbox-primary mr-2"
                        />
                        Public memory
                      </label>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-sm text-gray-600">
                            Signers list* (addresses separated by a comma)
                          </span>
                        </label>
                        <input
                          type="text"
                          value={signersList}
                          onChange={handleSignersList}
                          placeholder="0x00000000..."
                          className="input input-bordered"
                        />
                        <span
                          className="text-xs mt-1"
                          style={{ maxWidth: "400px" }}
                        >
                          * you can leave the field blank, then the signature
                          will be by the link
                        </span>
                      </div>
                    </form>
                  </div>

                  <div className="mt-4 flex items-center">
                    <button
                      type="button"
                      className={classNames(
                        "btn btn-primary btn-sm",
                        isSaving ? "loading" : ""
                      )}
                      onClick={saveAndMintMemory}
                    >
                      Create memory
                    </button>
                    <span
                      className="ml-4 text-xs"
                      style={{ maxWidth: "250px" }}
                    >
                      Your memory will be minted on Polygon blockchain
                    </span>
                  </div>
                </div>
              ) : (
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Share memory with others
                  </Dialog.Title>
                  <div className="sm:max-w-lg w-full bg-white rounded-xl z-10 text-center max-w-140">
                    <img src={congrats} className="h-32 mx-auto" alt="" />
                    <p>You created and minted your memory!</p>
                    <p>
                      Share it with those you want to share, copy this link:{" "}
                      <code>
                        <Link
                          className="link link-primary text-xs"
                          to={`/app/memory/${memoryHash}`}
                        >
                          {`${window.location.hostname}/app/memory/${memoryHash}`}
                        </Link>
                      </code>
                    </p>
                    <p>
                      they have{" "}
                      <span className="font-bold">1 day deadline</span> to sign
                      it
                    </p>
                    <p>
                      and you can find your minted memory in{" "}
                      <Link className="link link-primary" to="/app/memory">
                        memories
                      </Link>
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm text-center"
                      onClick={() => closeModal()}
                    >
                      Okay!
                    </button>
                  </div>
                </div>
              )}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <div>
        <button
          className="btn btn-primary fixed right-10 bottom-8"
          onClick={() => openModal()}
        >
          Quick memory
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default QuickPost;
