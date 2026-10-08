import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Pencil, Link2 } from 'lucide-react';
import ImageComponent from '../componentGeneral/ImageComponent.jsx';
import useAuthAdminStore from '../../store/AuthAdminStore.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { isValidLink, normalizeLink } from '@/utils/carouselLink';

const LINK_PLACEHOLDER = 'Optional — e.g. /shop or https://example.com';

const CarouselUpload = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [link, setLink] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [editLink, setEditLink] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getallcarousel`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images', error);
      }
    };
    fetchImages();
  }, [apiUrl]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isValidLink(link)) {
      toast.error('Link must be a relative path (e.g. /shop) or an http(s) URL.');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('imgSrc', file);
    const trimmedLink = normalizeLink(link);
    if (trimmedLink) {
      formData.append('link', trimmedLink);
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/createcarousel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.imgSrc) {
        setImages((prevImages) => [...prevImages, response.data]);
        toast.success('Image uploaded!');
      }
    } catch (error) {
      console.error('Error uploading image', error);
      toast.error(
        error.response?.data?.message || 'Failed to upload image.',
      );
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const openEditDialog = (image) => {
    setEditTarget(image);
    setEditLink(image.link || '');
  };

  const handleLinkUpdate = async (e) => {
    e.preventDefault();
    if (!isValidLink(editLink)) {
      toast.error('Link must be a relative path (e.g. /shop) or an http(s) URL.');
      return;
    }

    setSavingEdit(true);
    try {
      const response = await axios.put(
        `${apiUrl}/updatecarousel/${editTarget._id}`,
        { link: normalizeLink(editLink) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setImages((prevImages) =>
        prevImages.map((image) =>
          image._id === editTarget._id ? response.data : image,
        ),
      );
      setEditTarget(null);
      toast.success('Link updated!');
    } catch (error) {
      console.error('Error updating link', error);
      toast.error(error.response?.data?.message || 'Failed to update link.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      await axios.delete(`${apiUrl}/deletebyidcarousel/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImages((prevImages) =>
        prevImages.filter((image) => image._id !== imageId),
      );
      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image', error);
      toast.error('Failed to delete image.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 shadow bg-white rounded-lg ">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold self-start">
        Manage Sliders Images
      </h1>
      <div className="w-full max-w-md space-y-2 self-start">
        <Label htmlFor="carouselLink">Link (optional)</Label>
        <Input
          id="carouselLink"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder={LINK_PLACEHOLDER}
        />
      </div>
      <label className="cursor-pointer inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition duration-300 mt-4">
        <Upload className="mr-2" size={18} />
        Select Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
      <p className="text-sm text-gray-500 mt-2 self-start">
        {normalizeLink(link)
          ? 'This image will link to the address above.'
          : 'No link set — this image will not be clickable.'}
      </p>

      {loading && <p className="text-blue-500 mt-3">Uploading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full">
        <AnimatePresence>
          {images.length > 0 ? (
            images.map((image) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative bg-white shadow rounded-lg overflow-hidden"
              >
                <ImageComponent
                  imageName={image.imgSrc}
                  className={' object-cover rounded-lg'}
                />
                {image.link && (
                  <a
                    href={image.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 left-2 inline-flex max-w-[70%] items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white"
                    title={image.link}
                  >
                    <Link2 size={12} className="shrink-0" />
                    <span className="truncate">{image.link}</span>
                  </a>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => openEditDialog(image)}
                    aria-label="Edit link"
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow transition duration-300"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(image._id)}
                    aria-label="Delete image"
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow transition duration-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3">No images uploaded yet.</p>
          )}
        </AnimatePresence>
      </div>

      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Optional. Paste a relative path like /shop or a full http(s) URL.
              Leave it empty to make this image non-clickable.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLinkUpdate}>
            <div className="space-y-2">
              <Label htmlFor="editLink">Link</Label>
              <Input
                id="editLink"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                placeholder={LINK_PLACEHOLDER}
                autoFocus
              />
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditTarget(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={savingEdit}>
                {savingEdit ? 'Saving...' : 'Save Link'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleImageDelete(deleteTarget)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarouselUpload;