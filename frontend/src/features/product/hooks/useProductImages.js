import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { productAdminApi } from '../api/productAdminApi';

export const useProductImages = (productId) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const loadImages = useCallback(async () => {
    if (!productId) {
      setImages([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await productAdminApi.getById(productId);

      const productData =
        res?.data?.data ||
        res?.data ||
        {};

      setImages(productData.images || []);
    } catch (error) {
      console.error('Load product images error:', error);

      toast.error(
        error.response?.data?.message ||
        'Không thể tải danh sách ảnh'
      );
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const uploadImages = useCallback(async (files) => {
    if (!productId || !files || files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      await productAdminApi.uploadImages(
        productId,
        formData
      );

      toast.success(
        `Đã tải lên ${files.length} ảnh thành công!`
      );

      await loadImages();
    } catch (error) {
      console.error('Upload product images error:', error);

      toast.error(
        error.response?.data?.message ||
        'Lỗi tải ảnh lên'
      );
    } finally {
      setIsUploading(false);
    }
  }, [productId, loadImages]);

  const deleteImage = useCallback(async (imageId) => {
    if (!productId || !imageId) {
      return;
    }

    if (
      !window.confirm(
        'Bạn có chắc chắn muốn xóa ảnh này?'
      )
    ) {
      return;
    }

    setDeletingImageId(imageId);

    try {
      await productAdminApi.deleteImage(
        productId,
        imageId
      );
      setImages((prev) =>
        prev.filter((image) => image.id !== imageId)
      );

      toast.success('Xóa ảnh thành công!');
    } catch (error) {
      console.error('Delete product image error:', error);

      toast.error(
        error.response?.data?.message ||
        'Lỗi khi xóa ảnh'
      );
    } finally {
      setDeletingImageId(null);
    }
  }, [productId]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return {
    images,
    isLoading,
    isUploading,
    deletingImageId,

    loadImages,
    uploadImages,
    deleteImage
  };
};